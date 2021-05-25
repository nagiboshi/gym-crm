import {Injectable} from '@angular/core';
import {PurchaseItem} from '../models/purchase';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Package} from '../models/package';
import {Member} from '../models/member';
import {ClassModel} from '../classes/class.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {isEmpty, remove} from 'lodash';
import {ScheduleMember} from '../models/schedule-member';
import {Freeze} from '../models/freeze';
import {PaymentMethod} from '../models/payment-method';
import {ClassCategory} from '../classes/class.category';
import {environment} from '../../environments/environment';
import {User} from '@models/user';
import {Branch} from '@models/branch';
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
  classesSubj = new BehaviorSubject<ClassModel[]>([]);
  classes$ = this.classesSubj.asObservable();
  schedulesSubj = new BehaviorSubject<ClassSchedule[]>([]);
  newPurchase = new Subject<PurchaseItem>();
  newPurchase$: Observable<PurchaseItem> = this.newPurchase.asObservable();
  classAdded = new Subject<ClassModel>();
  classAdded$: Observable<ClassModel> = this.classAdded.asObservable();
  packagesSubj = new BehaviorSubject<Package[]>([]);
  paymentMethodsSubj = new BehaviorSubject<PaymentMethod[]>([]);
  classCategoriesSubj = new BehaviorSubject<ClassCategory[]>([]);
  branchesSubj = new BehaviorSubject<Branch[]>([]);
  constructor(private httpClient: HttpClient) {
  }

  getMembers(size: number, filterNameLastNameOrPhone: string, offset: number): Observable<Member[]> {
    const params: HttpParams = new HttpParams()
      .append('size', size.toString())
      .append('filterNameLastNameOrPhone', filterNameLastNameOrPhone)
      .append('offset', offset.toString());
    return this.httpClient.get<Member[]>('/api/member', {params});
  }

  private _getDataList<T>(behaviorSubj: BehaviorSubject<T>, url: string, params?: any): Observable<T> {
    let result: Observable<T>;
    if (isEmpty(behaviorSubj.getValue())) {
      if (params) {
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
    const params = {from: startDate.getTime(), to: endDate.getTime()};
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

  removeMember(id: number) {
    return this.httpClient.delete('/api/member/' + id);
  }

  getMember(id: string) {
    // const params = new HttpParams().set('id', id);
    return this.httpClient.get<Member>('/api/member/' + id); // , {params});
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

  getPackages$(): Observable<Package[]> {
    return this.packagesSubj.asObservable();
  }

  getPackages(): Package[] {
    return this.packagesSubj.getValue();
  }

  getPaymentMethods(): PaymentMethod[] {
    return this.paymentMethodsSubj.getValue();
  }

  addPaymentMethod(newPaymentMethod: PaymentMethod) {
    return new Promise<PaymentMethod>((resolve, reject) => {
      this.httpClient.put<PaymentMethod>('/paymentMethod', newPaymentMethod).toPromise().then((addedPaymentMethod) => {
        if (newPaymentMethod.id == 0) {
          this.paymentMethodsSubj.next([addedPaymentMethod, ...this.paymentMethodsSubj.getValue()]);
        } else {
          debugger;
          const paymentMethods = this.paymentMethodsSubj.getValue();
          const index = paymentMethods.findIndex(c => c.id == newPaymentMethod.id);
          if (index != -1) {
            paymentMethods[index] = addedPaymentMethod;
          }

          this.paymentMethodsSubj.next([...paymentMethods]);
        }
        resolve(addedPaymentMethod);
      }).catch((e) => {
        reject(e);
      });

    });
  }

  removePaymentMethod(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.httpClient.delete(`/paymentMethod/${id}`).toPromise().then(() => {
        const paymentMethods = this.paymentMethodsSubj.getValue();
        remove(paymentMethods, c => c.id == id);
        this.paymentMethodsSubj.next([...paymentMethods]);
        resolve();
      });
    });
  }

  findMembers(firstLastNamePhoneNumber: string) {
    return this.getMembers(20, firstLastNamePhoneNumber, 0);
  }


  getClasses(): ClassModel[] {
    return this.classesSubj.getValue();
  }

  removeClass(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const params = new HttpParams().append('id', id.toString());
      return this.httpClient.delete('/class', {params}).toPromise().then(() => {
        const filteredClasses = this.classesSubj.getValue();
        remove(filteredClasses, c => c.id == id);
        this.classesSubj.next([...filteredClasses]);
        resolve();
      });
    });

  }

  getClassCategories(): ClassCategory[] {
    return this.classCategoriesSubj.getValue();
  }

  getBranches(): Branch[] {
    return this.branchesSubj.getValue();
  }

  newMember(member: FormData): Observable<Member> {
    return this.httpClient.post<Member>('/api/member', member);
  }


  addClass(newClass: ClassModel): Promise<ClassModel> {
    return new Promise<ClassModel>((resolve, reject) => {
      this.httpClient.put<ClassModel>('/class', newClass).toPromise().then((addedClass) => {
        if (newClass.id == 0) {
          this.classesSubj.next([addedClass, ...this.classesSubj.getValue()]);
        } else {
          const classes = this.classesSubj.getValue();
          const index = classes.findIndex(c => c.id == newClass.id);
          if (index != -1) {
            classes[index] = addedClass;
          }

          this.classesSubj.next([...classes]);
        }
        resolve(addedClass);
      }).catch((e) => {
        reject(e);
      });

    });
  }

  getDayMappings() {
    return {0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat'};
  }

  savePackage(packageElement: Package): Promise<Package> {
    return new Promise<Package>((resolve, reject) => {
      this.httpClient.post<Package>('/api/package', packageElement).toPromise().then((mergedPackage) => {
        const packages = this.packagesSubj.getValue();
        if (packageElement.id == 0) {
          this.packagesSubj.next([mergedPackage, ...packages]);
        } else {
          const packageIndex = packages.findIndex( p => p.id == packageElement.id);
          if( packageIndex != -1 ) {
            packages[packageIndex] = mergedPackage;
            this.packagesSubj.next([...packages]);
          }
        }

        resolve(mergedPackage);
      }).catch( e => reject(e));
    });

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
