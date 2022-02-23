import {PaymentMethod} from '@models/payment-method';
import {PropertyValue} from '@models/property';
import {Product} from '@models/product';
import {InventoryItem} from '../sales/invetory/inventory-list/inventory-item';


export class StockPurchase {
  id: number;
  saleDate: number;
  price: number;
  item?: InventoryItem;
  qty: number;
  itemId: number;
  paymentMethod?: PaymentMethod;
  paymentMethodId: number;

}
