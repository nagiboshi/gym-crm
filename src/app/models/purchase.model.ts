import {MembershipItem} from './membership-item.model';
import {Moment} from 'moment';
import * as _moment from 'moment';

const moment = _moment;
const threeDaysTS = 2.592e+8;

export interface PurchaseItem {
  id: number;
  item: MembershipItem;
  saleDate: number;
  startDate: number;
  price: number;
  note: string;
  isFreezed: boolean;
  lastFreezeTs?: number;
  memberId: number;
}

export interface PurchaseHistoryItem extends PurchaseItem {
  isExpired: boolean;
  isNearlyExpire: boolean;
}

export function toPurchaseHistoryItem(purchaseItem: PurchaseItem, expirationMoment: Moment): PurchaseHistoryItem {
  const purchaseExpiration = moment(purchaseItem.startDate)
                .add(purchaseItem.item.expirationLength, purchaseItem.item.expirationType).startOf('day')
                .toDate().getTime();

  const expirationTimeLeft = expirationMoment.clone().subtract(purchaseExpiration, 'milliseconds').startOf('day').toDate().getTime();


  return {
    ...purchaseItem, isExpired: expirationMoment.toDate().getTime() >= purchaseExpiration,
    isNearlyExpire: expirationTimeLeft > 0 && expirationTimeLeft <= threeDaysTS
  };
}
