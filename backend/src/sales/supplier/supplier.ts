import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Property} from '../properties/property';
import {PurchaseVoucher} from '../purchase-vouchers/purchase-voucher';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  name: string;

  @OneToMany(type => Property, (property: Property)=> property.supplier)
  properties: Property[];

  @OneToMany(type=> PurchaseVoucher, (purchaseVoucher: PurchaseVoucher) => purchaseVoucher.supplier)
  purchaseVouchers: PurchaseVoucher[];
}
