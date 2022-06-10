import {Transform, Type} from 'class-transformer';
import {Supplier} from '../supplier/supplier';
import {PropertyValue} from '../properties/property-value/property-value';

export class PurchaseVoucherSubmitItem {
  id: number;
  uid: string;
  name: string;
  price: number;
  qty: number;
  productId: number;
  @Type(() => PropertyValue)
  details: PropertyValue[];
}

export class PurchaseVoucherSubmit {
  @Type(() => Number)
  id: number;

  @Type(() => Date)
  @Transform(({value}) => new Date(value))
  from: Date;

  @Type(() => Date)
  @Transform(({value}) => { value == null ? null: new Date(value)})
  to?: Date;

  @Type(() => PurchaseVoucherSubmitItem)
  items: PurchaseVoucherSubmitItem[];

  @Type(() => Supplier)
  supplier: Supplier;


}
