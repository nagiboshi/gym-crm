import {Injectable, Injector} from '@angular/core';
import * as _moment from 'moment';
import {ExtendedMembershipPurchaseModel, MembershipPurchaseModel} from '@models/membership-purchase';
import {DiscountPipe} from '@shared/pipes/discount.pipe';
import {TaxPipe} from '@shared/pipes/tax.pipe';
import {TaxService} from '@shared/tax.service';
import {TotalPricePipe} from '@shared/pipes/total-price';

const moment = _moment;
const threeDaysTS = 2.592e+8;

@Injectable()
export class HelpersService {
  constructor(private injector: Injector) {
  }


  toNumber(arg: unknown): number {
    if (arg && typeof arg == 'string') {
      arg = parseInt(arg);
    }
    return arg as number;
  }


  download(blob: Blob, fileName: string): void {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }

  extendMembership(membershipPurchase: MembershipPurchaseModel): ExtendedMembershipPurchaseModel {
    if (!membershipPurchase) {
      return;
    }

    membershipPurchase.payments?.forEach(p => {
      if (typeof p.amount == 'string') {
        p.amount = parseFloat(p.amount);
      }
    });

    const expirationMoment = moment();

    if (membershipPurchase.freeze) {
      membershipPurchase.freeze.startDate = membershipPurchase.freeze.startDate ? new Date(membershipPurchase.freeze.startDate) : null; // this.helpers.bigIntStringToNumber(purchaseItem.freeze.startDate);
      membershipPurchase.freeze.endDate = membershipPurchase.freeze.endDate ? new Date(membershipPurchase.freeze.endDate) : null; // this.helpers.bigIntStringToNumber(purchaseItem.freeze.endDate);
    }
    //
    membershipPurchase.startDate = new Date(membershipPurchase.startDate); // this.helpers.bigIntStringToNumber(purchaseItem.startDate);

    if( membershipPurchase.membership ) {
      const purchaseExpiration = moment(membershipPurchase.startDate)
        .add(membershipPurchase.membership.expirationLength, membershipPurchase.membership.expirationType).startOf('day')
        .toDate().getTime();

      const expirationTimeLeft = expirationMoment.clone().subtract(purchaseExpiration, 'milliseconds').startOf('day').toDate().getTime();
      let allPaymentsAmount;
      if (membershipPurchase.payments.length == 0) {
        allPaymentsAmount = 0;
      } else {
        allPaymentsAmount = membershipPurchase.payments.map(p => p.amount).reduce((previousValue, currentValue) => {
          if (!previousValue) {
            previousValue = 0;
          }

          return currentValue + previousValue;
        });
      }
      const taxService = this.injector.get(TaxService);
      const priceWithTaxes = this.injector.get(TotalPricePipe).transform(membershipPurchase.price, 1, membershipPurchase.discount, taxService.getTaxes());
      return {
        ...membershipPurchase, isExpired: expirationMoment.toDate().getTime() >= purchaseExpiration,
        isFullyPaid: allPaymentsAmount >= priceWithTaxes,
        isFreezed: membershipPurchase.freeze && membershipPurchase.freeze.endDate == null,
        isNearlyExpire: expirationTimeLeft > 0 && expirationTimeLeft <= threeDaysTS
      };
    } else {
      return {
        ...membershipPurchase, isExpired: true,
        isFullyPaid: false,
        isFreezed: membershipPurchase.freeze && membershipPurchase.freeze.endDate == null,
        isNearlyExpire: true
      }
    }

    // }
  }

  toFormData(obj: any, rootName?: string, ignoreList?: string) {
    const formData = new FormData();

    const appendFormData = (data, root) => {
      if (!ignore(root)) {
        root = root || '';
        if (data instanceof File) {
          formData.append(root, data);
        } else if (Array.isArray(data)) {
          for (let i = 0; i < data.length; i++) {
            let key = root + '[' + i + ']';
            if (data[i] instanceof File) {
              key = root + '[]';
            }
            appendFormData(data[i], key);
          }
        } else if (data instanceof Date) {
            formData.append(root, data.toUTCString());
        } else if (typeof data === 'object' && data) {
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              if (root === '') {
                appendFormData(data[key], key);
              } else {
                appendFormData(data[key], root + '.' + key);
              }
            }
          }
        } else {
          if (data !== null && typeof data !== 'undefined') {
            formData.append(root, data);
          }
        }
      }
    };

    const ignore = (root) => {
      return Array.isArray(ignoreList)
        && ignoreList.some(function(x) {
          return x === root;
        });
    };

    appendFormData(obj, rootName);

    return formData;
  }


  getTotalFreezeDays(endDate: Date, startDate: Date) {
    return moment(endDate).diff(startDate, 'day');
    // moment.s Math.round( (endDate - startDate ) / (1000*60*60*24));
  }

  // // In db we saving date as bigint and in js it returns as a string
  // // so we need to conver it to int
  // bigIntStringToNumber(bigIntValue) {
  //   if( typeof bigIntValue == 'string' ) {
  //     return parseInt(bigIntValue);
  //   }
  //   return bigIntValue;
  // }
}
