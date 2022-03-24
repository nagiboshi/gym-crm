import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {MembershipGroup} from './membership-group';


@Entity({
  orderBy: {'id': 'ASC'}
})
export class Membership {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: false})
  isShared: boolean;

  @Column({nullable: true})
  numberOfParticipants?: number;

  @Column()
  name: string;

  @Column({default: new Date()})
  created: Date;

  @Column({nullable: true})
  expirationType: 'day'|'month'|'year';

  @Column({nullable: true})
  expirationLength: number;

  @ManyToOne(type => MembershipGroup, group => group.memberships, {onDelete: "CASCADE"})
  @JoinColumn()
  group: MembershipGroup;

}
