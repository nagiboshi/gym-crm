import {Injectable} from '@angular/core';
import {PurchaseItemModel} from '@models/purchase';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {Member} from '@models/member';
import {ClassModel} from '../classes/class.model';
import {HttpClient} from '@angular/common/http';
import {isEmpty} from 'lodash';
import {ScheduleMember} from '@models/schedule-member';
import {Branch} from '@models/branch';
import {map, tap} from 'rxjs/operators';
import {CondOperator, QueryFilter, RequestQueryBuilder} from '@nestjsx/crud-request';
import {HelpersService} from '@shared/helpers.service';
import {ProductCategoriesService} from '@shared/product-categories.service';

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

export interface DaySchedule {
  scheduleId: number;
  dayOfWeek: number;
  primalClass: ClassModel;
  timeStart: number;
  timeEnd: number;
  capacity: number;
  signedMembers$?: BehaviorSubject<ScheduleMember[]>;
}

@Injectable({providedIn: 'root'})
export class CommunicationService {
  schedulesSubj = new BehaviorSubject<ClassSchedule[]>([]);
  newPurchase = new Subject<PurchaseItemModel>();
  newPurchase$: Observable<PurchaseItemModel> = this.newPurchase.asObservable();
  branchesSubj = new BehaviorSubject<Branch[]>([]);
  memberCreated = new Subject<Member>();
  memberCreated$ = this.memberCreated.asObservable();
  userRoles: Map<number, UserRole>;

  constructor(private httpClient: HttpClient, private packageService: ProductCategoriesService, private helpers: HelpersService) {
    this.userRoles = new Map();
    this.userRoles.set(0, {key: 0, label: 'Operator'});
    this.userRoles.set(1, {key: 1, label: 'Accountant'});
    this.userRoles.set(2, {key: 2, label: 'Administrator'});
    this.userRoles.set(3, {key: 0, label: 'Super Administrator'});
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


  getSchedules(startDate: Date, endDate: Date): Observable<ClassSchedule[]> {
    const {from, to} = {from: startDate.getTime(), to: endDate.getTime()};

    const firstQueryPart: QueryFilter = {
      field: 'scheduleFrom',
      operator: CondOperator.BETWEEN,
      value: [from, to]
    };
    const secondQueryPart: QueryFilter =
      {
        field: 'scheduleUntil',
        operator: CondOperator.BETWEEN,
        value: [from, to]
      };

    const query = RequestQueryBuilder.create().setOr([firstQueryPart, secondQueryPart]).setJoin({
      field: 'signedMembers',
      select: ['memberId']
    }).query(false);
    return this.httpClient.get<ClassSchedule[]>('/api/class-schedule/?' + query).pipe(tap(res => this.schedulesSubj.next(res)));
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

  emitNewPurchase(purchase: PurchaseItemModel) {
    this.newPurchase.next(purchase);
  }

  removeMember(id: number) {
    return this.httpClient.delete('/api/member/' + id);
  }

  getMemberWithPurchases(id: string) {
    const query = '/?' + RequestQueryBuilder.create()
      .setJoin({field: 'purchaseItems'})
      .setJoin({field: 'purchaseItems.product'})
      .setJoin({field: 'purchaseItems.freeze'})
      .setJoin({field: 'purchaseItems.members'}).sortBy({
        field: 'purchaseItems.saleDate',
        order: 'DESC'
      }).query(false);
    return this.httpClient.get<Member>('/api/member/' + id + query).pipe(map<Member, Member>(member => {
      member.purchaseItems?.forEach(p => {
        p.startDate = this.helpers.bigIntStringToNumber(p.startDate);
        p.saleDate =  this.helpers.bigIntStringToNumber(p.saleDate);
        if (p.freeze) {
          p.freeze.startDate =  this.helpers.bigIntStringToNumber(p.freeze.startDate);
          p.freeze.endDate = this.helpers.bigIntStringToNumber(p.freeze.endDate);
        }
      });
      return member;
    }));
  }


  addSchedules(schedules: ClassSchedule[]) {
    return this.httpClient.put<ClassSchedule[]>('/schedules', schedules);
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

  // freezeMembership(freeze: PurchaseFreeze): Observable<PurchaseFreeze> {
  //   return this.httpClient.post<PurchaseFreeze>('/freeze', freeze);
  // }

  // findFreeze(purchaseId: number, startDate: number): Observable<PurchaseFreeze> {
  //   const params = new HttpParams().append('purchaseId', purchaseId.toString())
  //     .append('startDate', startDate.toString());
  //   return this.httpClient.get<PurchaseFreeze>('/freeze', {params});
  // }

}
