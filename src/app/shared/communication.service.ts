import {Injectable} from '@angular/core';
import {PurchaseItem} from '../models/purchase.model';
import {BehaviorSubject, Observable, of, Subject, zip} from 'rxjs';
import {MembershipService} from '../models/membership-service.model';
import {Member} from '../models/member.model';
import {ClassModel} from '../classes/class.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {isEmpty} from 'lodash';
import {ScheduleMember} from '../models/schedule-member.model';
import {Freeze} from '../models/freeze.model';


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
  primalClassSubj = new BehaviorSubject<ClassModel[]>([]);
  schedulesSubj = new BehaviorSubject<ClassSchedule[]>([]);
  newPurchase = new Subject<PurchaseItem>();
  newPurchase$: Observable<PurchaseItem> = this.newPurchase.asObservable();

  membershipServicesSubj = new BehaviorSubject<MembershipService[]>([]);

  constructor(private httpClient: HttpClient) {
  }

  getMembers(size: number, filterNameLastNameOrPhone: string, offset: number): Observable<Member[]> {
    const params: HttpParams = new HttpParams()
      .append('size', size.toString())
      .append('filterNameLastNameOrPhone', filterNameLastNameOrPhone)
      .append('offset', offset.toString());
    return this.httpClient.get<Member[]>('/members', {params});
  }

  private _getDataList<T>(behaviorSubj: BehaviorSubject<T>, url: string, params?: any): Observable<T> {
    let result: Observable<T>;
    if (isEmpty(behaviorSubj.getValue())) {
      if ( params ) {
        result = this.httpClient.get<T>(url, {params});
      } else {
        result = this.httpClient.get<T>(url);
      }


      return new Observable((observer) => {
        result.toPromise().then(data => {
          behaviorSubj.next(data);
          observer.next(data);
          observer.complete();
        });
      });
    }

    return behaviorSubj.asObservable();
  }


  getSchedules(startDate: Date, endDate: Date): Observable<ClassSchedule[]> {
    const params = { from: startDate.getTime(), to: endDate.getTime()};
    return this._getDataList<ClassSchedule[]>(this.schedulesSubj, '/schedules', params);
  }

  signIn(scheduleId: number, memberIds: number[], date: number): Observable<ScheduleMember[]> {
    const params = new HttpParams().append('scheduleId', scheduleId.toString())
      .append('memberIds', memberIds.toString())
      .append('date', date.toString());
    return this.httpClient.post<ScheduleMember[]>('/signMembers', {params});
  }

  emitNewPurchase(purchase: PurchaseItem) {
    this.newPurchase.next(purchase);
  }

  getMember(id: string) {
    const params = new HttpParams().set('id', id);
    return this.httpClient.get<Member>('/member', {params});
  }


  addSchedules(schedules: ClassSchedule[]) {
    return this.httpClient.put<ClassSchedule[]>('/schedules', schedules);
  }

  getMemberPurchases(memberId: number): Observable<PurchaseItem[]> {
    const params = new HttpParams().append('memberId', memberId.toString());
    return this.httpClient.get<PurchaseItem[]>('/purchases', {params});
  }

  getPurchaseItems(from: number, to: number): Observable<PurchaseItem[]> {
    const params = new HttpParams().append('from', from.toString()).set('to', to.toString());
    return this.httpClient.get<PurchaseItem[]>('/purchasesFromTo', {params});
  }

  getMembershipServices(): MembershipService[] {
    return this.membershipServicesSubj.getValue();
  }

  findMembers(firstLastNamePhoneNumber: string) {
    return this.getMembers(20, firstLastNamePhoneNumber, 0);
  }


  getClasses(): ClassModel[] {
    return this.primalClassSubj.getValue();
  }

  newMember(member: Member): Observable<Member> {
    return this.httpClient.put<Member>('/member', member);
  }


  getDayMappings() {
    return {0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat'};
  }

  savePurchase(purchase: PurchaseItem): Observable<PurchaseItem> {
    return this.httpClient.put<PurchaseItem>('/purchase', purchase);
  }

  updateMember(member: Member) {
    return this.httpClient.patch<Member>('/member', JSON.stringify(member));
  }

  freezeMembership(freeze: Freeze): Observable<Freeze> {
    return this.httpClient.post<Freeze>('/freeze', freeze);
  }

  findFreeze(purchaseId: number, startDate: number): Observable<Freeze> {
    const params = new HttpParams().append('purchaseId', purchaseId.toString())
      .append('startDate', startDate.toString());
    return this.httpClient.get<Freeze>('/freeze', {params});
  }
}
