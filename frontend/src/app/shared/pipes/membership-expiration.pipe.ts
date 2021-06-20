import {Pipe, PipeTransform} from '@angular/core';
import {Product} from '@models/product';
import {Moment} from 'moment';
import {DatePipe} from '@angular/common';
import {isNumber} from 'lodash';
import * as _moment from 'moment';

const moment = _moment;

@Pipe({
  name: 'membershipExpiration'
})
export class MembershipExpirationPipe implements PipeTransform {


  constructor(private datePipe: DatePipe) {
  }

  transform(product: Product, ...args: any[]): any {
    let [membershipStartDate] = args;
    if (isNumber(membershipStartDate)) {
      membershipStartDate = moment(membershipStartDate);
    }
    // TODO:: Only for membership products

    return this.datePipe.transform((membershipStartDate as Moment).clone()
      .add(product.expirationLength, product.expirationType).toDate());
  }

}
