import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {PackageItem} from './package-item';

@Entity()
export class Package {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => PackageItem, packageItem => packageItem.package, {cascade: true})
  items: PackageItem[];
}
