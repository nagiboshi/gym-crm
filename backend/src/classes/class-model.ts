import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ClassCategory} from '../class-category/class-category';
import {Branch} from '../branch/branch';

@Entity()
export class ClassModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne( type => ClassCategory)
  @JoinColumn({referencedColumnName: "id", name: "categoryId" })
  classCategory: ClassCategory;


  @Column({nullable: true})
  categoryId: number;


  @ManyToOne( type => Branch)
  @JoinColumn({referencedColumnName: "id", name: "branchId"})
  branch: Branch;

  @Column({nullable: true})
  branchId: number;
}
