import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ProductCategory} from './product-category';

@Entity()
export class ProductSubcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne( type => ProductCategory, category => category.id, {onDelete: "CASCADE", cascade: true})
  category: ProductCategory;
}
