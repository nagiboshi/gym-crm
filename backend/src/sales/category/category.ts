import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Subcategory} from './subcategory';

@Entity()
export class Category {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany( type => Subcategory, subcategory => subcategory.category)
  subcategories: Subcategory[];

  @Column({nullable: true, default: 'product'})
  type: string;
}
