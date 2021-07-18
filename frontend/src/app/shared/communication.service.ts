import {Injectable} from '@angular/core';
import {MembershipPurchaseModel} from '@models/purchase';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {Member} from '@models/member';
import {HttpClient} from '@angular/common/http';
import {isEmpty, first} from 'lodash';
import {ScheduleMember} from '@models/schedule-member';
import {Branch} from '@models/branch';
import {map, tap} from 'rxjs/operators';
import {CondOperator, QueryFilter, RequestQueryBuilder} from '@nestjsx/crud-request';
import {HelpersService} from '@shared/helpers.service';
import {MembershipGroupService} from '@shared/membership-group.service';

export interface UserRole {
  key: number;
  label: string;
}

export interface ClassSchedule {
  id: number;
  classId: number;
  timeStart: number;
  timeEnd: number;
  day: number;
  capacity: number;
  scheduleFrom: number;
  scheduleUntil: number;
  signedMembers?: ScheduleMember[];
  branchId: number;
}

export interface ScheduleWeekDay {
  day: number;
  label: string;
  date: Date;
}

export interface DaySchedule extends ClassSchedule {
  // scheduleId: number;
  // dayOfWeek: number;
  // primalClass: ClassModel;
  signedMembers$?: BehaviorSubject<ScheduleMember[]>;
}

@Injectable({providedIn: 'root'})
export class CommunicationService {
  schedulesSubj = new BehaviorSubject<ClassSchedule[]>([]);
  newPurchase = new Subject<MembershipPurchaseModel>();
  newPurchase$: Observable<MembershipPurchaseModel> = this.newPurchase.asObservable();
  branchesSubj = new BehaviorSubject<Branch[]>([]);
  memberCreated = new Subject<Member>();
  memberCreated$ = this.memberCreated.asObservable();
  userRoles: Map<number, UserRole>;

  constructor(private httpClient: HttpClient,
              private packageService: MembershipGroupService,
              private helpers: HelpersService) {
    this.userRoles = new Map();
    this.userRoles.set(0, {key: 0, label: 'Operator'});
    this.userRoles.set(1, {key: 1, label: 'Accountant'});
    this.userRoles.set(2, {key: 2, label: 'Administrator'});
    this.userRoles.set(3, {key: 3, label: 'Super Administrator'});
  }

  getMembersByIds(ids: number[]): Observable<Member[]> {
    if (ids.length != 0) {
      let url = '/api/member';
      const query = '/?' + RequestQueryBuilder.create().setFilter({
        field: 'id',
        value: ids,
        operator: CondOperator.IN
      }).setJoin({field: 'membershipPurchases'})
        .setJoin({field: 'membershipPurchases.membership'})
        .sortBy({field: 'membershipPurchases.saleDate', order: 'DESC'}).query(false);
      return this.httpClient.get<Member[]>(url + query);
    }
    return of(new Array<Member>());
  }

  getMembers(size: number, filterNameLastNameOrPhone: string, offset: number): Observable<Member[]> {

    let url = '/api/member';
    if (!isEmpty(filterNameLastNameOrPhone)) {
      const query = '/?' + RequestQueryBuilder.create().setOr([
        {
          field: 'firstName',
          operator: CondOperator.CONTAINS,
          value: filterNameLastNameOrPhone
        },
        {
          field: 'lastName',
          operator: CondOperator.CONTAINS,
          value: filterNameLastNameOrPhone
        },
        {
          field: 'phoneNumber',
          operator: CondOperator.CONTAINS,
          value: filterNameLastNameOrPhone
        },
      ]).query(false);
      url += query;
    }
    return this.httpClient.get<Member[]>(url);
  }

  fetchBranchesOfUser() {
    return this.httpClient.get('/api/branch/userBranches').toPromise().then((res) => console.log(res));
  }

  fetchBranches() {
    return this.httpClient.get<Branch[]>('/api/branch').pipe(tap(branches => {
      this.branchesSubj.next(branches);
    }));
  }

  getUserRoles(): Map<number, UserRole> {
    return this.userRoles;
  }


  private _getSchedulesQuery(startDate: Date | number, endDate: Date | number) {
    const {from, to} = {
      from: startDate instanceof Date ? startDate.getTime() : startDate,
      to: endDate instanceof Date ? endDate.getTime() : endDate
    };


    const scheduleFromLowerThenScheduleUntil = {
      field: 'scheduleFrom',
      operator: CondOperator.LOWER_THAN_EQUALS,
      value: to
    };


    const query1: Array<QueryFilter> = [scheduleFromLowerThenScheduleUntil,
      {
        field: 'scheduleUntil',
        operator: CondOperator.BETWEEN,
        value: [from, to]
      }];

    const query2: Array<QueryFilter> = [
      scheduleFromLowerThenScheduleUntil,
      {
        field: 'scheduleUntil',
        operator: CondOperator.GREATER_THAN,
        value: to
      }];

    return RequestQueryBuilder.create().setOr(query1).setOr(query2).setJoin({
      field: 'signedMembers',
      select: ['memberId']
    }).query(false);
  }

  getSchedules(startDate: Date, endDate: Date): Observable<DaySchedule[]> {
    const query = this._getSchedulesQuery(startDate, endDate);
    return this.httpClient.get<ClassSchedule[]>('/api/class-schedule/?' + query).pipe(
      map<ClassSchedule[], DaySchedule[]>((schedules) => {
        return schedules.map<DaySchedule>( s => this.classScheduleToDaySchedule(s))}),
      tap(res => this.schedulesSubj.next(res)));
  }

  classScheduleToDaySchedule( classSchedule: ClassSchedule) {
    classSchedule.scheduleFrom = this.helpers.bigIntStringToNumber(classSchedule.scheduleFrom);
    classSchedule.scheduleUntil = this.helpers.bigIntStringToNumber(classSchedule.scheduleUntil);
    return {...classSchedule, ...{signedMembers$:new BehaviorSubject(classSchedule.signedMembers)}};
  }

  addSchedules(schedules: ClassSchedule[]) {
    // when we are adding schedules they would have the same scheduleFrom, scheduleUntil.
    const scheduleExmpl = first(schedules);
    const query = this._getSchedulesQuery(scheduleExmpl.scheduleFrom, scheduleExmpl.scheduleUntil);
    return this.httpClient.post<ClassSchedule[]>('/api/class-schedule/bulk?' + query, {bulk: schedules}).pipe(
      // map( /**/s => {...s, {..}})
      map( newSchedules => newSchedules.map( s => this.classScheduleToDaySchedule(s)) )
    );
  }

  signIn(scheduleId: number, memberIds: number[], scheduleDate: number): Observable<ScheduleMember[]> {

    const scheduleMembers = memberIds.map((memberId) => {
      return {
        id: 0,
        scheduleId: scheduleId,
        memberId: memberId,
        scheduleDate: scheduleDate
      };
    });
    return this.httpClient.post<ScheduleMember[]>('/api/schedule-member/bulk', {bulk: scheduleMembers});
  }

  emitNewPurchase(purchase: MembershipPurchaseModel) {
    this.newPurchase.next(purchase);
  }

  removeMember(id: number) {
    return this.httpClient.delete('/api/member/' + id);
  }

  getMemberWithPurchases(id: string | number, joinPurchaseFreeze = true, joinPurchaseProduct = true, joinPurchaseMembers = true) {
    const query = RequestQueryBuilder.create()
      .setJoin({field: 'membershipPurchases'})
      .setJoin({field: 'membershipPurchases.membership'});
    if (joinPurchaseFreeze) {
      query.setJoin({field: 'membershipPurchases.freeze'});
    }


    if (joinPurchaseMembers) {
      query.setJoin({field: 'membershipPurchases.members'});
    }
    query.sortBy({
      field: 'membershipPurchases.saleDate',
      order: 'DESC'
    });
    const resultedQuery = '/?' + query.query(false);
    return this.httpClient.get<Member>('/api/member/' + id + resultedQuery).pipe(map<Member, Member>(member => {
      member.membershipPurchases?.forEach(p => {
        p.startDate = this.helpers.bigIntStringToNumber(p.startDate);
        p.saleDate = this.helpers.bigIntStringToNumber(p.saleDate);
        if (p.freeze) {
          p.freeze.startDate = this.helpers.bigIntStringToNumber(p.freeze.startDate);
          p.freeze.endDate = this.helpers.bigIntStringToNumber(p.freeze.endDate);
        }
      });
      return member;
    }));
  }


  findMembers(firstLastNamePhoneNumber: string): Observable<Member[]> {
    return this.getMembers(20, firstLastNamePhoneNumber, 0);
  }


  getBranches(): Branch[] {
    return this.branchesSubj.getValue();
  }


  saveMember(member: Member): Observable<Member> {
    const formData: FormData = this.helpers.toFormData(member);
    return this.httpClient.post<Member>('/api/member', formData);
  }


  getDayMappings() {
    return {0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat'};
  }


  updateMember(member: Member) {
    return this.httpClient.patch<Member>('/member', JSON.stringify(member));
  }

}
