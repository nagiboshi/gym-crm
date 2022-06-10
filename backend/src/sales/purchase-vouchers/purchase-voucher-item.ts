import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Supplier} from '../supplier/supplier';
import {PurchaseVoucher} from './purchase-voucher';
import {Product} from '../product/product';
import {PropertyValue} from '../properties/property-value/property-value';
import {PurchaseVoucherSubmitItem} from './purchase-voucher.submit';

@Entity()
export class PurchaseVoucherItem {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  qty: number;

  @ManyToOne(type => PurchaseVoucher, purchaseVoucher => purchaseVoucher.items, {persistence: true,cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE", orphanedRowAction: "delete"})
  purchaseVoucher: PurchaseVoucher;

  @Column()
  purchaseVoucherId: number;

  @Column()
  price: number;

  @ManyToOne( type => Product, product => product.purchaseVoucherItems, {cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE"})
  product: Product;

  @Column()
  productId: number;

  @OneToMany( type => PropertyValue, propertyValue => propertyValue.purchaseVoucherItem )
  details: PropertyValue[];

  public static valueOf(purchaseVoucherSubmitItem: PurchaseVoucherSubmitItem, purchaseVoucher: PurchaseVoucher, details: PropertyValue[]) {
    const purchaseVoucherItem = new PurchaseVoucherItem();
    purchaseVoucherItem.purchaseVoucher = purchaseVoucher;
    purchaseVoucherItem.id = 0;
    purchaseVoucherItem.qty = purchaseVoucherSubmitItem.qty;
    purchaseVoucherItem.price = purchaseVoucherSubmitItem.price;
    purchaseVoucherItem.productId = purchaseVoucherSubmitItem.productId;
    purchaseVoucherItem.details = details;
    return purchaseVoucherItem;
  }
}
