import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {PropertyValue} from './property-value/property-value';
import {Supplier} from '../supplier/supplier';
import {Product} from '../product/product';
import {Subcategory} from '../category/subcategory';

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => PropertyValue, productPropertyValue => productPropertyValue.property, {
    cascade: true
  })
  values: PropertyValue[];

  @ManyToOne(type => Supplier, { onDelete: "CASCADE", onUpdate: "CASCADE",  cascade: true, nullable: true})
  supplier: Supplier;

  @ManyToOne( type => Product, { onDelete: "CASCADE", onUpdate: "CASCADE",  cascade: true, nullable: true})
  product: Product;

  @ManyToOne( type => Subcategory, {nullable: true, onDelete: "CASCADE"})
  subcategory: Subcategory;
}
