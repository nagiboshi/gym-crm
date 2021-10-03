import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Property} from '../properties/property';
import {Subcategory} from '../category/subcategory';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => Property, property => property.product, {cascade: true} )
  properties: Property[];

  @ManyToOne(type => Subcategory)
  @JoinColumn({referencedColumnName: "id", name: 'subcategoryId'})
  subcategory: Subcategory;

  @Column()
  subcategoryId: number;
}
