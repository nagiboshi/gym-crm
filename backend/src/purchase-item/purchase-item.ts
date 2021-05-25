import {Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PaymentMethod} from '../payment-method/payment-method';
import {PurchaseFreeze} from './purchase-freeze';
import {Member} from '../member/member';
import {PackageItem} from '../package/package-item';

@Entity()
export class PurchaseItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  saleDate: number;

  @Column()
  startDate: number;

  @Column()
  price: number;

  @Column()
  note: string;

  @ManyToOne(type => PackageItem)
  item: PackageItem;

  @ManyToOne( type => PaymentMethod)
  paymentMethod: PaymentMethod;

  @OneToOne(type => PurchaseFreeze)
  freeze: PurchaseFreeze;

  @OneToOne(type => Member)
  member: Member;
}
