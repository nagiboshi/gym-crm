import {Product} from '@models/product';
import {PropertyValue} from '@models/property';
import {Supplier} from '@models/supplier';


export interface Stock {
  id: number;
  product: Product;
  details: PropertyValue[],
  supplier: Supplier;
  subcategory: any;
  price: number;
  qty: number;
}
