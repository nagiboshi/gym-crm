import {Injectable} from '@angular/core';
import {ServicePurchaseModel} from '@models/membership-purchase';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {first} from 'lodash';
import {ScheduleMember} from '@models/schedule-member';
import {Branch} from '@models/branch';
import {map, tap} from 'rxjs/operators';
import {CondOperator, QueryFilter, RequestQueryBuilder} from '@nestjsx/crud-request';
import {HelpersService} from '@shared/helpers.service';
import {MembershipGroupService} from '@shared/membership-group.service';
import {Tax} from '@models/tax';

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
  scheduleFrom: Date;
  scheduleUntil: Date;
  signedMembers?: ScheduleMember[];
  branchId: number;
}

export interface ScheduleWeekDay {
  day: number;
  label: string;
  date: Date;
}

export interface DaySchedule extends ClassSchedule {
  signedMembers$: BehaviorSubject<ScheduleMember[]>;
}

@Injectable({providedIn: 'root'})
export class CommunicationService {
  schedulesSubj = new BehaviorSubject<ClassSchedule[]>([]);
  newPurchase = new Subject<ServicePurchaseModel>();
  branchesSubj = new BehaviorSubject<Branch[]>([]);

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


  private _getSchedulesQuery(startDate: Date, endDate: Date) {

    const {from, to} = {
      from: JSON.stringify(startDate),
      to: JSON.stringify(endDate)
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
      select: ['memberId', 'scheduleDate']
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
    classSchedule.scheduleFrom = new Date(classSchedule.scheduleFrom);
    classSchedule.scheduleUntil = new Date(classSchedule.scheduleUntil);
    classSchedule.signedMembers.forEach( signedMember => {
      if( typeof signedMember.scheduleDate == 'string') {
        signedMember.scheduleDate = new Date(signedMember.scheduleDate);
      }
    });
    return {...classSchedule, signedMembers$: new BehaviorSubject(classSchedule.signedMembers) };
  }

  addSchedules(schedules: ClassSchedule[]) {
    // when we are adding schedules they would have the same scheduleFrom, scheduleUntil.
    const scheduleExmpl = first(schedules);
    const query = this._getSchedulesQuery(scheduleExmpl.scheduleFrom, scheduleExmpl.scheduleUntil);
    return this.httpClient.post<ClassSchedule[]>('/api/class-schedule/bulk?' + query, {bulk: schedules}).pipe(
      map( newSchedules => newSchedules.map( s => this.classScheduleToDaySchedule(s)) )
    );
  }

  getTaxes(): Tax[]{
    return [{id:1, name: "VAT 5%", value: 5 }];
  }

  signIn(scheduleId: number, memberIds: number[], scheduleDate: Date): Observable<ScheduleMember[]> {

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

  emitNewPurchase(purchase: ServicePurchaseModel) {
    this.newPurchase.next(purchase);
  }


  getBranches(): Branch[] {
    return this.branchesSubj.getValue();
  }



  getDayMappings() {
    return {0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat'};
  }


}
