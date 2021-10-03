import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Property} from '../properties/property';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => Property, property => property.supplier)
  properties: Property[];
}
