import {Injectable} from '@angular/core';
import {PurchaseItem} from '../models/purchase.model';
import {BehaviorSubject, Observable, of, zip} from 'rxjs';
import {MembershipService} from '../models/membership-service.model';
import {Member} from '../models/member.model';
import {PrimalClassModel} from '../classes/primal-class.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {isEmpty} from 'lodash';
import {ScheduleMember} from '../models/schedule-member.model';


export interface ClassSchedule {
  id: number;
  classId: number;
  timeStart: number;
  timeEnd: number;
  day: number;
  capacity: number;
  scheduleUntil: number;
  signedMembers?: ScheduleMember[];
}

export interface ScheduleWeekDay {
  day: number;
  label: string;
  date: Date;
}

export interface DaySchedule {
  dayOfWeek: number;
  primalClass: PrimalClassModel;
  timeStart: number;
  timeEnd: number;
  capacity: number;
  signedMembers$?: BehaviorSubject<ScheduleMember[]>;
}


@Injectable({providedIn: 'root'})
export class CommunicationService {
  primalClassSubj = new BehaviorSubject<PrimalClassModel[]>([]);
  schedulesSubj = new BehaviorSubject<ClassSchedule[]>([]);
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

  private _getDataList<T>(behaviorSubj: BehaviorSubject<T>, url: string, params?: Map<string, any>): Observable<T> {
    let result: Observable<T>;
    let httpParams;
    if ( params ) {
      httpParams = new HttpParams();
      for ( const [paramName, paramValue] of params) {
        httpParams.set(paramName, paramValue.toString());
      }
    }

    if (isEmpty(behaviorSubj.getValue())) {
      if ( httpParams ) {
        result = this.httpClient.get<T>(url, {params: httpParams});
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
    const params: Map<string, any> = new Map();
    params.set('from', startDate.getTime());
    params.set('to', endDate.getTime());
    return this._getDataList<ClassSchedule[]>(this.schedulesSubj, '/schedules', params);
  }

  signIn(schedule: ClassSchedule, member: Member): Promise<any> {
    return new Promise((resolve, reject) => {
      const foundMember = schedule.signedMembers.find((m) => m.id == member.id );
      if (!foundMember) {
        const params = new HttpParams().set('scheduleId', schedule.id.toString()).set('memberId', member.id.toString());
        this.httpClient.post('/signMember', {params}).toPromise().then(() => {
          resolve();
        });
      } else  {
        resolve();
      }
    });
  }

  getMember(id: string) {
    const params = new HttpParams().set('id', id);
    return this.httpClient.get<Member>('/member', {params});
  }


  addSchedules(schedules: ClassSchedule[]) {
    // debugger;
   return this.httpClient.put<ClassSchedule[]>('/schedules', schedules );
  }

  getMemberPurchases(memberId: number): Observable<PurchaseItem[]> {
    const params = new HttpParams().set('memberId', memberId.toString());
    return this.httpClient.get<PurchaseItem[]>('/purchases', {params});
  }

  getMembershipServices(): MembershipService[] {
    return this.membershipServicesSubj.getValue();
  }

  findMembers(firstLastNamePhoneNumber: string){
      return this.getMembers(20, firstLastNamePhoneNumber, 0);
  }


  getClasses(): PrimalClassModel[] {
    return this.primalClassSubj.getValue();
  }

  newMember(member: Member): Observable<Member> {
    return this.httpClient.put<Member>('/member', member);
  }


  getDayMappings() {
    return {0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat'};
  }

  savePurchase(purchase: PurchaseItem): Observable<PurchaseItem> {
    return this.httpClient.put<PurchaseItem>('/purchase', purchase );
  }

  updateMember(member: Member) {
   return this.httpClient.patch<Member>('/member', JSON.stringify(member) );
  }
}
