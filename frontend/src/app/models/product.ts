import {Subcategory} from '@models/category';
import {Property} from '@models/property';

export interface Product {
  id: number;
  name: string;
  properties: Property[];
  photoLinks: string[];
  subcategory: Subcategory;
  subcategoryId: number;
}
