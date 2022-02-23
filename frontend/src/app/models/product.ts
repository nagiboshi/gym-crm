import {Subcategory} from '@models/category';
import {Property} from '@models/property';
import {Supplier} from '@models/supplier';
import {v4 as UUID} from 'uuid';
import {PurchaseVoucher} from './purchase-voucher';

export interface Product{
  id: number;
  name: string;
  images?: string[] | FileList;
  properties?: Property[];
  subcategory?: Subcategory;
  subcategoryId?: number;
}

