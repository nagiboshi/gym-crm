import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {ProductSubcategory} from './product-subcategory';

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({nullable: true})
  description: string;

  @OneToMany(type => ProductSubcategory, c => c.category  )
  subcategories: ProductSubcategory[];
}
