import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Product} from '../product/product';
import {PropertyValue} from '../properties/property-value/property-value';
import {PurchaseVoucher} from '../purchase-vouchers/purchase-voucher';
import {PurchaseVoucherItem} from '../purchase-vouchers/purchase-voucher-item';

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

  @ManyToMany( type => PropertyValue, details => details.inventoryItems, {eager: true})
  @JoinTable()
  details: PropertyValue[];

  @ManyToOne( type => PurchaseVoucher)
  purchaseVoucher: PurchaseVoucher;

  @Column()
  purchaseVoucherId: number;

  constructor(purchaseVoucherItem?: PurchaseVoucherItem) {
    if( purchaseVoucherItem) {
        this.id = 0;
        this.product = purchaseVoucherItem.product;
        this.qty = purchaseVoucherItem.qty;
        this.price = purchaseVoucherItem.price;
        this.details = purchaseVoucherItem.details;
        this.purchaseVoucherId = purchaseVoucherItem.id;
    }
  }
}
