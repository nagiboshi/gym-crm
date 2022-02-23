import {Product} from '@models/product';
import {PropertyValue} from '@models/property';

export class InventoryItem {
  id: number;
  supplier: string;
  qty: number;
  price: number;
  product: Product;
  details: Array<PropertyValue>;
}
