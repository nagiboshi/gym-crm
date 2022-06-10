import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Product} from '../product/product';
import {PropertyValue} from '../properties/property-value/property-value';
import {PurchaseVoucherItem} from '../purchase-vouchers/purchase-voucher-item';
import {Branch} from '../../branch/branch';

export const InventoryItemFields = {
  product: 'product',
  details: 'details'
}
@Entity()
export class InventoryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Product, item => item.inventoryItems, {eager: true, cascade: true, onUpdate: "CASCADE", onDelete: "CASCADE"} )
  product: Product;

  @Column()
  qty: number;

  @Column()
  price: number;

  @ManyToMany( type => PropertyValue, details => details.inventoryItems, {eager: true, orphanedRowAction: "delete"})
  @JoinTable()
  details: PropertyValue[];

  @ManyToOne( type => Branch, branch => branch.inventoryItems  )
  @JoinColumn({name: "branchId"})
  branch: Branch;

  @Column()
  branchId: number;

  constructor(purchaseVoucherItem?: PurchaseVoucherItem, branchId?: number) {
    if( purchaseVoucherItem) {
        this.id = 0;
        this.product = purchaseVoucherItem.product;
        this.qty = purchaseVoucherItem.qty;
        this.price = purchaseVoucherItem.price;
        this.details = purchaseVoucherItem.details;
        this.branchId = branchId;
    }
  }
}
