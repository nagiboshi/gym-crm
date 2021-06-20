import {Product} from './product';
import {Member} from '@models/member';
import {PurchaseFreeze} from '@models/purchase-freeze';



export interface PurchaseItemModel {
  id: number;
  productId: number;
  product: Product;
  saleDate: number;
  startDate: number;
  freeze: PurchaseFreeze;
  freezeId: number;
  price: number;
  note: string;
  paymentMethodId: number;
  members: Member[];
}


export interface PurchaseHistoryItem extends PurchaseItemModel {
  isExpired: boolean;
  isNearlyExpire: boolean;
  isFreezed: boolean;
}

// export function toPurchaseItemModel(purchaseItem: PurchaseItem): PurchaseItemModel;

