import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {ProductField} from '../product-fields/product-field';
import {ProductSubcategory} from '../product-category/product-subcategory';
import {ProductTag} from '../tags/product-tag';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => ProductField, propertyType => propertyType.product, {cascade: true} )
  fields: ProductField[];

  @Column({default: 0})
  price: number;

  @Column("text", {array: true, default: []})
  photoLinks: string[];

  @ManyToOne(type => ProductSubcategory)
  @JoinColumn({referencedColumnName: "id"})
  subcategory: ProductSubcategory;

  @ManyToMany(type => ProductTag, {cascade: true} )
  @JoinTable()
  tags: ProductTag[]
}
