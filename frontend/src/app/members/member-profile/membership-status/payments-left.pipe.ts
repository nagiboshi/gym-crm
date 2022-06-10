import {Pipe, PipeTransform} from '@angular/core';
import {ExtendedMembershipPurchaseModel} from '@models/membership-purchase';
import {TotalPricePipe} from '@shared/pipes/total-price';
import {TaxService} from '@shared/tax.service';
import {Payment} from '@models/payment';

@Pipe({
  name: 'paymentsLeft'
})
export class PaymentsLeftPipe implements PipeTransform {

  constructor(private totalPricePipe: TotalPricePipe, private taxService: TaxService) {
  }

  transform(value: ExtendedMembershipPurchaseModel, ...args: [payments: Payment[]]): unknown {
    const [payments] = args;
    const totalPrice = this.totalPricePipe.transform(value.price, 1, value.discount, this.taxService.getTaxes());
    const paidValue = payments.length != 0 ? payments.map(p => p.amount).reduce((previousValue, currentValue) => previousValue + currentValue) : 0;
    return totalPrice - paidValue;
  }

}
