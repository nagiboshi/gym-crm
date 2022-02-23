import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Category} from './category';
import {Property} from '../properties/property';

@Entity()
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(type => Category, category => category.id,{
    onDelete: "CASCADE",
  })
  category: Category;

  @Column()
  categoryId: number;

  @OneToMany(type => Property, property => property.subcategory, {
    nullable: true,
    cascade: true
  })
  properties: Property[];
}
