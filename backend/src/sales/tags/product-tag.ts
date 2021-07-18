import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {ProductFieldOption} from '../product-property/product-field-option';

@Entity()
export class ProductTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
