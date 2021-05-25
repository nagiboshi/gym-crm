import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class ClassCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
