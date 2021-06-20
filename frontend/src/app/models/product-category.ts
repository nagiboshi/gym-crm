import {Product} from './product';

export enum ProductType {
  Membership, Other
}

export interface ProductCategory {
  id: number;
  name: string;
  products: Product[];
  type: ProductType;
}
