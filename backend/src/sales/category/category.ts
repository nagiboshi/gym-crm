import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Subcategory} from './subcategory';
import {Branch} from '../../branch/branch';

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

  @OneToMany( type => Subcategory, subcategory => subcategory.category,{nullable: true, cascade: ["insert", "update", "remove"], orphanedRowAction: "delete"})
  subcategories?: Subcategory[];

  @Column({nullable: true, default: 'stock'})
  type: string;

  @ManyToOne(type => Branch, obj => obj.categories)
  @JoinColumn({name:"branchId"})
  branch: Branch;

  @Column()
  branchId: number;

}
