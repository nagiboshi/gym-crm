import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Supplier} from '../supplier/supplier';
import { Product } from '../product/product';
import {PurchaseVoucherItem} from './purchase-voucher-item';

@Entity()
export class PurchaseVoucher {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from: Date;

  @Column({nullable: true})
  to: Date;

  @OneToMany(type => PurchaseVoucherItem, (voucherItem: PurchaseVoucherItem)=> voucherItem.purchaseVoucher)
  items: PurchaseVoucherItem[]

  @ManyToOne(type => Supplier, {onDelete: "CASCADE", onUpdate: "CASCADE", cascade: true})
  supplier: Supplier;

}
