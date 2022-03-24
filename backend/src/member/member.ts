import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {IsEmail, IsMobilePhone, IsNotEmpty, MinLength} from 'class-validator';
import {MembershipPurchase} from '../membership-purchase/membership-purchase';
import {SocialNetworkAccount} from '../social-network-account/social-network-account';

export const MemberFields = {
  membershipPurchases: 'membershipPurchases',
  activeMembership: 'activeMembership',
  socialAccounts: 'socialAccounts',
  created: 'created'
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
  activeMembership: MembershipPurchase;
}
