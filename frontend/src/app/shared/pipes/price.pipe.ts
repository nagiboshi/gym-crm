import {Pipe, PipeTransform} from '@angular/core';
import {first} from 'lodash';
import {HelpersService} from '@shared/helpers.service';

@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {

  constructor(private helpers: HelpersService) {
  }

  transform(price: number, ...args: any[]): number {
    let [qty] = args;

    if(!qty) {
      qty = 1;
    }

    const qtyNumber  = this.helpers.toNumber(qty);
   return price * qtyNumber;
  }

}
