import {Stock} from '../stock/stock';
import {StockProperty} from '../stock-properties/stock-property';
import {Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';


@Entity()
export class InventoryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Stock, stock => stock.invetoryItems)
  stock: Stock;

  @ManyToMany(type => StockProperty, property => property.inventoryItems)
  properties: StockProperty[];

  @Column()
  qty: number;


}
