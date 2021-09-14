import {Pipe, PipeTransform} from '@angular/core';
import {first} from 'lodash';
import {Tax} from '@models/tax';

@Pipe({
  name: 'totalPrice'
})
export class TotalPricePipe implements PipeTransform {


  toNumber(arg: unknown): number {
    if( arg && typeof  arg == 'string') {
      arg = parseInt(arg);
    }
    return arg as number;
  }

  transform(price: number, ...args: [qty: number, discount: number, taxes: Tax[]]): number {
    let [qty, discount, taxes] = args;

    if(!qty) {
      qty = 1;
    }

    const qtyNumber  = this.toNumber(qty);
    const totalPrice = price * qtyNumber;

    if(!discount) {
      discount = 0;
    }

    const discountNumber = this.toNumber(discount);

    let discountedValue = totalPrice -  totalPrice * (discountNumber / 100);
    const sumOfTaxes =
      taxes.map((tax) => discountedValue * (tax.value/ 100))
        .reduce((acc, next) => acc + next);
    return discountedValue + sumOfTaxes;
  }

}
