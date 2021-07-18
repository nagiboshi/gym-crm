import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ProductField} from '../product-fields/product-field';
import {ProductSubcategory} from '../product-category/product-subcategory';
import {ProductTag} from '../tags/product-tag';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(type => ProductField, propertyType => propertyType.options)
  @JoinTable()
  fields: ProductField[];

  @Column({default: 0})
  price: number;

  @Column("text", {array: true, default: []})
  photoLinks: string[];

  @ManyToOne(type => ProductSubcategory)
  @JoinColumn({referencedColumnName: "id"})
  subcategory: ProductSubcategory;

  @ManyToMany(type => ProductTag )
  @JoinTable()
  tags: ProductTag[]
}
