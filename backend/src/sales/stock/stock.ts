import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Category} from '../category/category';
import {Subcategory} from '../category/subcategory';
import {PropertyValue} from '../properties/property-value/property-value';
import {Supplier} from '../supplier/supplier';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column()
  price: number;

  @ManyToOne(type=>Supplier)
  supplier: Supplier;

  @OneToMany(type => PropertyValue, propertyValue => propertyValue.stock, {nullable: true})
  details: PropertyValue[];

  @ManyToOne(type => Category)
  @JoinColumn({referencedColumnName: "id"})
  category: Category;

  @ManyToOne(type => Subcategory)
  @JoinColumn({referencedColumnName: "id"})
  subcategory: Subcategory;
}
