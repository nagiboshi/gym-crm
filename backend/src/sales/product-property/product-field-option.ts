import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ProductField} from '../product-fields/product-field';

@Entity()
export class ProductFieldOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @ManyToOne(type => ProductField)
  productField: ProductField;
}
