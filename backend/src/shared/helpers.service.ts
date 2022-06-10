import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import {Inject, Injectable, Scope} from '@nestjs/common';
import {MembershipPurchase} from '../membership-purchase/membership-purchase';
import {Moment} from 'moment';
import * as moment from 'moment';

@Injectable()
export class HelpersService {
  constructor(@Inject(REQUEST) public readonly request: Request) {}

  public getMembershipExpirationMoment(membership: MembershipPurchase): Moment {
    let membershipExpirationDate: Moment;
    if (membership) {
      membershipExpirationDate = moment(membership.startDate);
      const expirationType = membership.membership.expirationType;

      if (expirationType == 'day') {
        membershipExpirationDate.add(membership.membership.expirationLength, 'day');
      } else if (expirationType == 'month') {
        membershipExpirationDate.add(membership.membership.expirationLength, 'month');
      } else {
        membershipExpirationDate.add(membership.membership.expirationLength, 'year');
      }
    }
    return membershipExpirationDate;
  }
}
