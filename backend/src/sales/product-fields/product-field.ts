import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {ProductFieldOption} from '../product-property/product-field-option';

@Entity()
export class ProductField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(type => ProductFieldOption, productProperty => productProperty.productField, {cascade: true})
  options: ProductFieldOption[];
}
