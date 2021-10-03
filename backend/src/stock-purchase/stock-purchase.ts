import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PaymentMethod} from '../payment-method/payment-method';
import {Stock} from '../sales/stock/stock';
import {User} from '../user/user';


@Entity()
export class StockPurchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'bigint'})
  saleDate: number;

  @Column()
  price: number;


  @ManyToOne(type => Stock, {onDelete: "CASCADE"})
  @JoinColumn({name: 'stockId', referencedColumnName: 'id'})
  stock: Stock;

  @Column()
  quantity: number;

  @Column()
  stockId: number;

  @ManyToOne( type => PaymentMethod)
  @JoinColumn({name: 'paymentMethodId', referencedColumnName: 'id'})
  paymentMethod: PaymentMethod;

  @Column()
  paymentMethodId: number;

  @ManyToOne(type=> User)
  @JoinColumn({name: 'sellerId', referencedColumnName: 'id'})
  seller: User;


}
