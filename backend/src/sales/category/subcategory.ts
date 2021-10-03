import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Category} from './category';
import {Product} from '../product/product';

@Entity()
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(type => Category, category => category.id, {onDelete: 'CASCADE', cascade: true})
  category: Category;

  @OneToMany(type => Product, product => product.subcategory, {onDelete: 'CASCADE'})
  product: Product;
}
