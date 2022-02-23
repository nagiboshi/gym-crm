import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {InventoryItem} from '../inventory/inventory-item';
import {PurchaseVoucherItem} from '../purchase-vouchers/purchase-voucher-item';
import {Property} from '../properties/property';
import {Type} from 'class-transformer';

export class ProductSubmit {
  id: number;
  name: string;
  images?: string[];
  @Type( () => Property)
  properties: Property[];
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('simple-array', {nullable: true})
  images: string[];

  @OneToMany( type => InventoryItem, item => item.product)
  inventoryItems?: InventoryItem[];

  @OneToMany( type => PurchaseVoucherItem, item => item.product)
  purchaseVoucherItems?: PurchaseVoucherItem;

  @OneToMany( type => Property, property => property.product)
  properties?: Property[];
}
