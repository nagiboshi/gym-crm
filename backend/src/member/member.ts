import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {IsEmail, IsMobilePhone, IsNotEmpty, MinLength} from 'class-validator';
import {MembershipPurchase} from '../membership-purchase/membership-purchase';
import {SocialNetworkAccount} from '../social-network-account/social-network-account';
import {Branch} from '../branch/branch';

export const MemberFields = {
  membershipPurchases: 'membershipPurchases',
  activeMembership: 'activeMembership',
  activeMembershipId: 'activeMembershipId',
  socialAccounts: 'socialAccounts',
  created: 'created',
  branchId: 'branchId'
}

@Entity()
export class Member {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MinLength(1)
  @IsNotEmpty({always: true})
  firstName: string;

  @Column()
  @IsNotEmpty()
  lastName: string;

  @Column({nullable: true})
  photoLink: string;

  @Column({nullable: true})
  @IsMobilePhone()
  phoneNumber: string;

  @Column({nullable: true})
  @IsMobilePhone()
  emergencyPhone: string;

  @OneToMany( type => SocialNetworkAccount, social => social.member, {nullable: true})
  socialAccounts: SocialNetworkAccount[];

  @Column({nullable: true})
  dob: Date;

  @Column()
  @IsEmail()
  email: string;

  @Column({default: new Date()})
  created: Date;

  @Column()
  @IsNotEmpty()
  gender: string;

  @Column({nullable: true})
  notes?: string;

  @Column({nullable: true})
  referalType?: string;

  @ManyToOne(type => Member, member => member.id)
  @JoinColumn({referencedColumnName: "id"})
  referalMember: Member;

  @ManyToMany( type => MembershipPurchase, membershipPurchase => membershipPurchase.members, {onDelete: "CASCADE", onUpdate: "CASCADE", cascade: true})
  membershipPurchases: MembershipPurchase[];

  @ManyToOne(type => MembershipPurchase, {nullable: true})
  @JoinColumn({name: 'activeMembershipId', referencedColumnName: 'id'})
  activeMembership: MembershipPurchase;

  @Column({nullable: true})
  activeMembershipId: number;

  @Column({nullable: true})
  branchId: number;

  @Column({default: 'shared'})
  type: 'local'|'shared';

  @ManyToOne(type=> Branch, b => b.members, {onDelete: "CASCADE", onUpdate: "CASCADE", cascade: true, nullable: true})
  @JoinColumn({name:"branchId"})
  branch: Branch;
}
