import {Pipe, PipeTransform} from '@angular/core';
import {PackageItem} from '../../models/package-item';
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

  transform(membershipItem: PackageItem, ...args: any[]): any {
    let [membershipStartDate] = args;
    if (isNumber(membershipStartDate)) {
      membershipStartDate = moment(membershipStartDate);
    }
    return this.datePipe.transform((membershipStartDate as Moment).clone()
      .add(membershipItem.expirationLength, membershipItem.expirationType).toDate());
  }

}
