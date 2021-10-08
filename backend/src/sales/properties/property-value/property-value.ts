import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Property} from '../property';
import {Supplier} from '../../supplier/supplier';
import {Stock} from '../../stock/stock';

@Entity()
export class PropertyValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @ManyToOne(type => Property)
  @JoinColumn()
  property: Property;

  @ManyToOne(type => Supplier, {onDelete: "CASCADE"})
  @JoinColumn()
  supplier: Supplier;

  @ManyToOne(type => Stock, {onDelete:"CASCADE"})
  @JoinColumn()
  stock: Stock;
}
