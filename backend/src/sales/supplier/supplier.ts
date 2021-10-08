import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Property} from '../properties/property';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  name: string;

  @OneToMany(type => Property, (property: Property)=> property.supplier, {cascade: ["insert", "update", "remove"]})
  properties: Property[];
}
