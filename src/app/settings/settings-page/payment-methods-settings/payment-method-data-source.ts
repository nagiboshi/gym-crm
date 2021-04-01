import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {PaymentMethod} from '../../../models/payment-method';
import {CommunicationService} from '@shared/communication.service';
export class PaymentMethodDataSource extends DataSource<PaymentMethod> {
  data: BehaviorSubject<PaymentMethod[]>;
  constructor(private communicationService: CommunicationService) {
    super();
    this.data = this.communicationService.paymentMethodsSubj;
  }

  connect(collectionViewer: CollectionViewer): Observable<PaymentMethod[] | ReadonlyArray<PaymentMethod>> {
    return this.data.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }


}
