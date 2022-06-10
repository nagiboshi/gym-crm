import { Pipe, PipeTransform } from '@angular/core';
import {Payment} from '@models/payment';
import {PaymentMethodService} from '../settings/settings-page/payment-methods-settings/payment-method.service';

@Pipe({
  name: 'paymentName'
})
export class PaymentNamePipe implements PipeTransform {

  constructor(private paymentService: PaymentMethodService) {
  }
  transform(value: Payment, ...args: any[]): unknown {
    const [paymentMethodId] = args;
    if( !paymentMethodId ) {
      return;
    }

    const paymentMethod = this.paymentService.getPaymentMethods().find(p => p.id == paymentMethodId);
    return paymentMethod.name;
  }

}
