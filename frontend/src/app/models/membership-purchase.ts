import {Membership} from './membership';
import {Member} from '@models/member';
import {PurchaseFreeze} from '@models/purchase-freeze';



export interface MembershipPurchaseModel {
  id: number;
  membershipId: number;
  membership: Membership;
  saleDate: number;
  startDate: number;
  freeze: PurchaseFreeze;
  freezeId: number;
  price: number;
  note: string;
  paymentMethodId: number;
  members: Member[];
}


export interface MembershipPurchaseHistoryItem extends MembershipPurchaseModel {
  isExpired: boolean;
  isNearlyExpire: boolean;
  isFreezed: boolean;
}

// export function toPurchaseItemModel(purchaseItem: PurchaseItem): PurchaseItemModel;

