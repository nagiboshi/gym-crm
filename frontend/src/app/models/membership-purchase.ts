import {Membership} from './membership';
import {Member} from '@models/member';
import {PurchaseFreeze} from '@models/purchase-freeze';
import {InventoryItem} from '../sales/invetory/inventory-list/inventory-item';
import {PaymentMethod} from '@models/payment-method';

export interface ServicePurchaseModel {
  id: number;
  membershipId: number;
  membership?: Membership;
  saleDate: Date;
  startDate: Date;
  freeze?: PurchaseFreeze;
  freezeId: number;
  price: number;
  note: string;
  paymentMethodId: number;
  members: Member[];
}


export interface MembershipPurchaseHistoryItem extends ServicePurchaseModel {
  isExpired: boolean;
  isNearlyExpire: boolean;
  isFreezed: boolean;
}

// export function toPurchaseItemModel(purchaseItem: PurchaseItem): PurchaseItemModel;

