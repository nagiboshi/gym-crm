import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {PropertyValue} from '../properties/property-value/property-value';
import {Supplier} from '../supplier/supplier';
import {Product} from '../product/product';
import {Property} from '../properties/property';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-array', {nullable: true})
  images: string[];

  @Column()
  price: number;

  @ManyToOne(type => Product)
  product: Product;

  @ManyToOne(type => Supplier)
  supplier: Supplier;

  @OneToMany(type => PropertyValue, propertyValue => propertyValue.stock, {cascade: ['insert', 'update', 'remove'], nullable: true})
  details: PropertyValue[];

  @OneToMany(type => Property, property => property.stock, {cascade: ['insert', 'update', 'remove'], nullable: true})
  properties: Property[];
}
