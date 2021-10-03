import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {PropertyValue} from './property-value/property-value';
import {Product} from '../product/product';
import {Supplier} from '../supplier/supplier';

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => PropertyValue, stockPropertyValue => stockPropertyValue.property, {nullable: true})
  values: PropertyValue[];

  @ManyToOne(type => Product, {onDelete: "CASCADE", nullable: true} )
  product: Product;

  @ManyToOne(type => Supplier, {onDelete: "CASCADE", nullable: true})
  supplier: Supplier;

}
