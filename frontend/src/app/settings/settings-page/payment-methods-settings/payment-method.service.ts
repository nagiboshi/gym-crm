import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {PaymentMethod} from '@models/payment-method';
import {remove} from 'lodash';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {
  paymentMethodsSubj = new BehaviorSubject<PaymentMethod[]>([]);
  paymentMethods$ = this.paymentMethodsSubj.asObservable();

  constructor(private httpClient: HttpClient) {
  }


  removePaymentMethod(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.httpClient.delete(`api/payment-method/${id}`).toPromise().then(() => {
        const paymentMethods = this.paymentMethodsSubj.getValue();
        remove(paymentMethods, c => c.id == id);
        this.paymentMethodsSubj.next([...paymentMethods]);
        resolve();
      });
    });
  }


  fetchPaymentMethods(): Observable<PaymentMethod[]> {
    return this.httpClient.get<PaymentMethod[]>('/api/payment-method').pipe(tap((paymentMethods) => {
      this.paymentMethodsSubj.next(paymentMethods);
    }));
  }

  addPaymentMethod(newPaymentMethod: PaymentMethod) {
    return new Promise<PaymentMethod>((resolve, reject) => {
      this.httpClient.post<PaymentMethod>('/api/payment-method', newPaymentMethod).toPromise().then((addedPaymentMethod) => {
        if (newPaymentMethod.id == 0) {
          this.paymentMethodsSubj.next([addedPaymentMethod, ...this.paymentMethodsSubj.getValue()]);
        } else {
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

  getPaymentMethods(): PaymentMethod[] {
    return this.paymentMethodsSubj.getValue();
  }
}
