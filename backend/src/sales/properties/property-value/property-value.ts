import {Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Property} from '../property';
import {Supplier} from '../../supplier/supplier';
import {Product} from '../../product/product';
import {InventoryItem} from '../../inventory/inventory-item';
import {PurchaseVoucherItem} from '../../purchase-vouchers/purchase-voucher-item';

@Entity()
export class PropertyValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @ManyToOne(type => Property, {onDelete: "CASCADE", persistence: true})
  @JoinColumn()
  property?: Property;

  @Column()
  propertyId: number;

  @ManyToOne(type => Supplier, {onDelete: "CASCADE"})
  @JoinColumn()
  supplier?: Supplier;

  @ManyToOne( type => PurchaseVoucherItem, {cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE"})
  purchaseVoucherItem?: PurchaseVoucherItem;

  @ManyToMany( type => InventoryItem, item => item.details, {persistence: true ,onDelete: "CASCADE", onUpdate: "CASCADE", cascade: true})
  inventoryItems?: InventoryItem;
}
