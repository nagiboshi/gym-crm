import {Pipe, PipeTransform} from '@angular/core';
import {Membership} from '@models/membership';
import {Moment} from 'moment';
import {DatePipe} from '@angular/common';
import {isString} from 'lodash';
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
    // TODO:: Only for membership products

    return this.datePipe.transform(moment(membershipStartDate).clone()
      .add(membership.expirationLength, membership.expirationType).toDate());
  }

}
