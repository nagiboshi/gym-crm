import {Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {ProductFieldOption} from '../product-property/product-field-option';
import {Product} from '../product/product';

@Entity()
export class ProductField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => ProductFieldOption, productFieldOption => productFieldOption.productField)
  options: ProductFieldOption[];

  @Column()
  fieldType: number;

  @ManyToOne( type => Product)
  product: Product;

}
