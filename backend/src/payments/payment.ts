import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {MembershipPurchase} from '../membership-purchase/membership-purchase';
import {StockPurchase} from '../sales/stock-purchase/stock-purchase';
import {PaymentMethod} from '../payment-method/payment-method';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("decimal", {scale: 2})
  amount: number;

  @Column()
  date: Date;

  @ManyToOne( type => PaymentMethod)
  @JoinColumn({name: 'paymentMethodId', referencedColumnName: 'id'})
  paymentMethod: PaymentMethod;

  @Column()
  paymentMethodId: number;

  @Column({nullable: true})
  membershipPurchaseId: number;

  @ManyToOne(type => MembershipPurchase, mp => mp.payments, {eager: false, cascade: true, onUpdate: "CASCADE", onDelete: "CASCADE"})
  @JoinColumn({name: 'membershipPurchaseId', referencedColumnName: 'id'})
  membershipPurchase: MembershipPurchase;

  @Column({nullable: true})
  stockPurchaseId;

  @ManyToOne(type => StockPurchase, mp => mp.purchases, {eager: false, cascade: true, onUpdate: "CASCADE", onDelete: "CASCADE"})
  @JoinColumn({name: 'stockPurchaseId', referencedColumnName: 'id'})
  stockPurchase: StockPurchase;
}
