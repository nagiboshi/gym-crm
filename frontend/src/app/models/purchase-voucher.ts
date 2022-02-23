import {Supplier} from '@models/supplier';
import {Product} from '@models/product';
import {InventoryItem} from '../sales/invetory/inventory-list/inventory-item';
import {PropertyValue} from '@models/property';

export interface PurchaseVoucher {
  id: number;
  from: number;
  to?: number;
  supplier: Supplier;
  items: PurchaseVoucherItem[];
}

export class PurchaseVoucherItem {
  id: number;
  qty: number;
  purchaseVoucher: PurchaseVoucher;
  price: number;
  product?: Product;
  productId: number;
  details: PropertyValue[];
}


export class PurchaseVoucherSubmitModel {
  id: number;
  from: string;
  to?: string;
  items: PurchaseVoucherItem[];
  supplier: Supplier;
  productUIDToImageName: object;
}
