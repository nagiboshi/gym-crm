import {PaymentMethod} from '@models/payment-method';
import {PropertyValue} from '@models/property';
import {Product} from '@models/product';
import {InventoryItem} from '../sales/invetory/inventory-list/inventory-item';
import {Payment} from '@models/payment';


export class StockPurchase {
  id: number;
  saleDate: number;
  price: number;
  item?: InventoryItem;
  qty: number;
  itemId: number;
  note: string;
  discount: number;
  payments: Payment[]
  buyerId: number;
}
