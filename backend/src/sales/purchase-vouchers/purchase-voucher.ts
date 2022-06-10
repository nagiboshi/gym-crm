import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Supplier} from '../supplier/supplier';
import {PurchaseVoucherItem} from './purchase-voucher-item';
import {Branch} from '../../branch/branch';

@Entity()
export class PurchaseVoucher {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from: Date;

  @Column({type: "date", default: null, nullable: true})
  to: Date;

  @OneToMany(type => PurchaseVoucherItem, (voucherItem: PurchaseVoucherItem)=> voucherItem.purchaseVoucher)
  items: PurchaseVoucherItem[]

  @ManyToOne(type => Supplier, {onDelete: "CASCADE", onUpdate: "CASCADE", cascade: true})
  supplier: Supplier;

  @ManyToOne( type => Branch, b => b.purchaseVouchers, {nullable: true})
  branch: Branch;

  @Column({nullable: true})
  branchId: number;

  @Column({default: 'local'})
  type: string;
}
