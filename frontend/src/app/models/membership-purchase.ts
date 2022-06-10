import {Membership} from './membership';
import {Member} from '@models/member';
import {PurchaseFreeze} from '@models/purchase-freeze';
import {InventoryItem} from '../sales/invetory/inventory-list/inventory-item';
import {PaymentMethod} from '@models/payment-method';
import {Payment} from '@models/payment';

export interface MembershipPurchaseModel {
  id: number;
  membershipId: number;
  membership?: Membership;
  startDate: Date;
  discount: number;
  freeze?: PurchaseFreeze;
  freezeId: number;
  price: number;
  note: string;
  payments: Payment[];
  members: Member[];
  buyer?: Member;
  buyerId: number;
}


export interface ExtendedMembershipPurchaseModel extends MembershipPurchaseModel {
  isExpired: boolean;
  isNearlyExpire: boolean;
  isFreezed: boolean;
  isFullyPaid: boolean;
}

// export function toPurchaseItemModel(purchaseItem: PurchaseItem): PurchaseItemModel;

