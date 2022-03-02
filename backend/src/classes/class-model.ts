import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ClassCategory} from '../class-category/class-category';
import {Branch} from '../branch/branch';
import {Category} from '../sales/category/category';

@Entity()
export class ClassModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne( type => Category, (c) => c.type)
  classCategory: Category;

  @Column({nullable: true})
  categoryId: number;

  @ManyToOne( type => Branch)
  @JoinColumn({referencedColumnName: "id", name: "branchId"})
  branch: Branch;

  @Column({nullable: true})
  branchId: number;
}
