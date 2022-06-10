import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {PaymentMethod} from '../../payment-method/payment-method';
import {User} from '../../user/user';
import {InventoryItem} from '../inventory/inventory-item';
import {Payment} from '../../payments/payment';
import {Member} from '../../member/member';
import {Branch} from '../../branch/branch';

export const StockPurchaseFields = {
  item: 'item',
  buyer: 'buyer',
  saleLocation: 'saleLocation'
}
@Entity()
export class StockPurchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'bigint'})
  saleDate: number;

  @Column()
  price: number;

  @ManyToOne(type => InventoryItem, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'itemId', referencedColumnName: 'id'})
  item: InventoryItem;

  @Column()
  qty: number;

  @Column()
  itemId: number;

  @Column({nullable: true, default: ''})
  note: string;

  @OneToMany(type => Payment, payment => payment.stockPurchase)
  payments: Payment[];

  @Column({default: 0})
  discount: number;

  @ManyToOne(type => User)
  @JoinColumn({name: 'sellerId', referencedColumnName: 'id'})
  seller?: User;

  @Column()
  sellerId: number;

  @ManyToOne(type => Member, { onDelete: "CASCADE", onUpdate: "CASCADE",  cascade: true, nullable: true})
  @JoinColumn({name: 'buyerId', referencedColumnName: 'id'})
  buyer: Member;

  @ManyToOne(type => Branch, { onDelete: "CASCADE", onUpdate: "CASCADE",  cascade: true, nullable: true})
  @JoinColumn({name: 'saleLocationId', referencedColumnName: 'id'})
  saleLocation: Branch;

  @Column({nullable: true})
  saleLocationId: number;

  @Column({nullable: true})
  buyerId: number;

}
