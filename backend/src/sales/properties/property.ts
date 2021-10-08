import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {PropertyValue} from './property-value/property-value';
import {Product} from '../product/product';
import {Supplier} from '../supplier/supplier';
import {Stock} from '../stock/stock';

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => PropertyValue, stockPropertyValue => stockPropertyValue.property, {
    cascade: ['insert', 'update'],
    onDelete: 'CASCADE',
    nullable: true
  })
  values: PropertyValue[];

  @ManyToOne(type => Product, {nullable: true})
  product: Product;

  @ManyToOne(type => Supplier, {nullable: true})
  supplier: Supplier;

  @ManyToOne( type => Stock, {nullable: true})
  stock: Stock;
}
