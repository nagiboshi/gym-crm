import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Branch} from '../branch/branch';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => Branch, branch => branch.company )
  branches: Branch[];
}
