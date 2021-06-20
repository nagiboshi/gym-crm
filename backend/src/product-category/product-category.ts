import {Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Product} from './product';

@Entity()
export class ProductCategory {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => Product, product => product.productCategory, {cascade: true, onDelete: "CASCADE"})
  @JoinColumn()
  products: Product[];
}
