import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Member} from '../member/member';

@Entity()
export class SocialNetworkAccount {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @ManyToOne( type => Member, {cascade: true, onUpdate: "CASCADE", onDelete: "CASCADE"})
  @JoinColumn({name: 'memberId', referencedColumnName: 'id'})
  member: Member;

  @Column()
  memberId: number;

}
