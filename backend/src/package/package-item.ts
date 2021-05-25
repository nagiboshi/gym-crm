import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Package} from './package';

@Entity({
  orderBy: {'id': 'ASC'}
})
export class PackageItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: false, nullable: true})
  isShared?: boolean;

  @Column({nullable: true})
  numberOfParticipants?: number;

  @Column()
  name: string;

  @Column()
  expirationType: 'day'|'month'|'year';

  @Column()
  expirationLength: number;

  @ManyToOne(type => Package, pckg => pckg.items)
  package: Package;
}
