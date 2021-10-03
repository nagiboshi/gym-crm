import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {IsEmail, IsMobilePhone, IsNotEmpty, MinLength} from 'class-validator';
import {MembershipPurchase} from '../membership-purchase/membership-purchase';

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

  @Column()
  photoLink: string;

  @Column({nullable: true})
  @IsMobilePhone()
  phoneNumber: string;

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
}
