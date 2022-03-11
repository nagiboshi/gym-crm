import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Subcategory} from './subcategory';

export const CategoryFields = {
  id: 'id',
  name: 'name',
  subcategories: 'subcategories',
  type: 'type'
}

@Entity()
export class Category {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany( type => Subcategory, subcategory => subcategory.category,{nullable: true, cascade: ["insert", "update", "remove"]})
  subcategories?: Subcategory[];

  @Column({nullable: true, default: 'stock'})
  type: string;

}
