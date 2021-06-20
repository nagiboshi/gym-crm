import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PaymentMethod} from '../payment-method/payment-method';
import {PurchaseFreeze} from './purchase-freeze';
import {Member} from '../member/member';
import {Product} from '../product-category/product';


@Entity()
export class PurchaseItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'bigint'})
  saleDate: number;

  @Column({type: 'bigint'})
  startDate: number;

  @Column()
  price: number;

  @Column()
  note: string;

  @ManyToOne(type => Product)
  @JoinColumn({name: 'productId', referencedColumnName: 'id'})
  product: Product;

  @Column()
  productId: number;

  @ManyToOne( type => PaymentMethod)
  @JoinColumn({name: 'paymentMethodId', referencedColumnName: 'id'})
  paymentMethod: PaymentMethod;

  @Column()
  paymentMethodId: number;

  @OneToOne(type => PurchaseFreeze, {nullable: true, cascade: true})
  @JoinColumn({name: 'freezeId'})
  freeze: PurchaseFreeze;

  @Column({nullable: true})
  freezeId: number;

  @ManyToMany( type => Member, member => member.purchaseItems)
  @JoinTable()
  members: Member[];

}
