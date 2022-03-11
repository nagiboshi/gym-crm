import { Injectable } from '@angular/core';
import * as _moment from 'moment';
import {MembershipPurchaseHistoryItem, ServicePurchaseModel} from '@models/membership-purchase';
import {Moment} from 'moment';

const moment = _moment;
const threeDaysTS = 2.592e+8;
@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor() { }


  toNumber(arg: unknown): number {
    if( arg && typeof  arg == 'string') {
      arg = parseInt(arg);
    }
    return arg as number;
  }


  download(blob: Blob, fileName: string): void {
    const a = document.createElement('a')
    const objectUrl = URL.createObjectURL(blob)
    a.href = objectUrl
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }

  extendMembership(purchaseItem: ServicePurchaseModel) {
    // toPurchaseHistoryItem(purchaseItem: ServicePurchaseModel, expirationMoment: Moment): MembershipPurchaseHistoryItem {
      if( !purchaseItem ) {
        return;
      }

      const expirationMoment = moment();

      if( purchaseItem.freeze ) {
        purchaseItem.freeze.startDate = purchaseItem.freeze.startDate ? new Date(purchaseItem.freeze.startDate): null; // this.helpers.bigIntStringToNumber(purchaseItem.freeze.startDate);
        purchaseItem.freeze.endDate = purchaseItem.freeze.endDate? new Date(purchaseItem.freeze.endDate): null; // this.helpers.bigIntStringToNumber(purchaseItem.freeze.endDate);
      }
      //
      purchaseItem.startDate = new Date(purchaseItem.startDate); // this.helpers.bigIntStringToNumber(purchaseItem.startDate);
      purchaseItem.saleDate = new Date(purchaseItem.saleDate); // this.helpers.bigIntStringToNumber(purchaseItem.saleDate);

      const purchaseExpiration = moment(purchaseItem.startDate)
        .add(purchaseItem.membership.expirationLength, purchaseItem.membership.expirationType).startOf('day')
        .toDate().getTime();

      const expirationTimeLeft = expirationMoment.clone().subtract(purchaseExpiration, 'milliseconds').startOf('day').toDate().getTime();

      return {
        ...purchaseItem, isExpired: expirationMoment.toDate().getTime() >= purchaseExpiration,
        isFreezed: purchaseItem.freeze && purchaseItem.freeze.endDate == null,
        isNearlyExpire: expirationTimeLeft > 0 && expirationTimeLeft <= threeDaysTS
      };
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
    }

    const ignore = (root) => {
      return Array.isArray(ignoreList)
        && ignoreList.some(function(x) { return x === root; });
    }

    appendFormData(obj, rootName);

    return formData;
  }



  getTotalFreezeDays(endDate: Date, startDate: Date ) {
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
