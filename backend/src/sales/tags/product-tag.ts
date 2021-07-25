import {Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {ProductFieldOption} from '../product-property/product-field-option';
import {Product} from '../product/product';

@Entity()
export class ProductTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @ManyToMany( type => Product, product => product.tags)
  products: Product[]

}
