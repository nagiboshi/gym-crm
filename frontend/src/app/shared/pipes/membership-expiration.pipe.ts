import {Pipe, PipeTransform} from '@angular/core';
import {Membership} from '@models/membership';
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

  transform(membership: Membership, ...args: any[]): any {
    let [membershipStartDate] = args;
    if (isNumber(membershipStartDate)) {
      membershipStartDate = moment(membershipStartDate);
    }
    // TODO:: Only for membership products

    return this.datePipe.transform((membershipStartDate as Moment).clone()
      .add(membership.expirationLength, membership.expirationType).toDate());
  }

}
