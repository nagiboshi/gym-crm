
export enum ProductType {
  Membership, Misc
}


export interface Product {
  id: number;
  isShared?: boolean;
  numberOfParticipants?: number;
  name: string;
  expirationType?: 'day'|'month'|'year';
  expirationLength?: number;
  type: ProductType;
}
