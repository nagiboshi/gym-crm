import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Membership} from './membership';

@Entity()
export class MembershipGroup {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => Membership, membership => membership.group, {cascade: true})
  memberships: Membership[];

  @Column({default: new Date()})
  created: Date;
}
