import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PaymentMethod} from '../../payment-method/payment-method';
import {User} from '../../user/user';
import {InventoryItem} from '../inventory/inventory-item';


@Entity()
export class StockPurchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'bigint'})
  saleDate: number;

  @Column()
  price: number;

  @ManyToOne(type => InventoryItem, {onDelete: "CASCADE"})
  @JoinColumn({name: 'productId', referencedColumnName: 'id'})
  item: InventoryItem;

  @Column()
  qty: number;

  @Column()
  itemId: number;

  @ManyToOne( type => PaymentMethod)
  @JoinColumn({name: 'paymentMethodId', referencedColumnName: 'id'})
  paymentMethod: PaymentMethod;

  @Column()
  paymentMethodId: number;

  @ManyToOne(type=> User)
  @JoinColumn({name: 'sellerId', referencedColumnName: 'id'})
  seller?: User;

  @Column()
  sellerId: number;


}
