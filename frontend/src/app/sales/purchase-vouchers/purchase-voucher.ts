import {Stock} from '@models/stock';
import {Supplier} from '@models/supplier';

export interface PurchaseVoucher {
  id: number;
  from: number;
  to?: number;
  supplier: Supplier;
  qty: number;
  stocks: Stock[];
}
