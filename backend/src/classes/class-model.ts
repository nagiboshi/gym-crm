import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ClassCategory} from '../class-category/class-category';
import {Branch} from '../branch/branch';

@Entity()
export class ClassModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne( type => ClassCategory)
  classCategory: ClassCategory;

  // @ManyToOne( type => Branch)
  // branch: Branch;
}
