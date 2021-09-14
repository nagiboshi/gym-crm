import { Pipe, PipeTransform } from '@angular/core';
import {HelpersService} from '@shared/helpers.service';

@Pipe({
  name: 'discount'
})
export class DiscountPipe implements PipeTransform {


  constructor(private helpers: HelpersService) {
  }

  transform(value: any, ...args: any[]): any {
    let [discountInPercentage] =  args;
    discountInPercentage = this.helpers.toNumber(discountInPercentage);
    return value -  value * (discountInPercentage / 100);
  }

}
