import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Membership} from './membership';
import {Branch} from '../branch/branch';

@Entity()
export class MembershipGroup {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => Membership, membership => membership.group, {cascade: true, orphanedRowAction: 'delete'})
  memberships: Membership[];

  @Column({default: new Date()})
  created: Date;

  @ManyToOne( type => Branch, branch => branch.membershipGroups )
  @JoinColumn({name: "branchId"})
  branch: Branch;

  @Column({nullable: true})
  branchId: number;

  @Column({default: 'local'})
  type: 'shared'|'local';
}
