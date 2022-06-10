import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PaymentMethod} from '../payment-method/payment-method';
import {MembershipFreeze} from './membership-freeze';
import {Member} from '../member/member';
import {Membership} from '../membership-group/membership';
import {Payment} from '../payments/payment';
import {Branch} from '../branch/branch';

export const MembershipPurchaseFields = {
  membership: 'membership',
  payments: 'payments',
  buyer: 'buyer',
  saleLocation: 'saleLocation',
}

@Entity()
export class MembershipPurchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: Date;

  @Column({default: new Date()})
  saleDate: Date;

  @Column()
  price: number;

  @Column()
  note: string;

  @Column()
  discount: number;

  @OneToMany(type => Payment, purchase => purchase.membershipPurchase )
  payments: Payment[];

  @ManyToOne(type => Membership, {onDelete: "CASCADE"})
  @JoinColumn({name: 'membershipId', referencedColumnName: 'id'})
  membership: Membership;

  @ManyToOne(type => Member, { onDelete: "CASCADE", onUpdate: "CASCADE",  cascade: true, nullable: true})
  @JoinColumn({name: 'buyerId', referencedColumnName: 'id'})
  buyer: Member;

  @ManyToOne(type => Branch, { onDelete: "CASCADE", onUpdate: "CASCADE",  cascade: true, nullable: true})
  @JoinColumn({name: 'saleLocationId', referencedColumnName: 'id'})
  saleLocation: Branch;

  @Column({nullable: true})
  saleLocationId: number;

  @Column()
  buyerId: number;

  @Column()
  membershipId: number;

  @OneToOne(type => MembershipFreeze, {nullable: true, cascade: true})
  @JoinColumn({name: 'freezeId'})
  freeze: MembershipFreeze;

  @Column({nullable: true})
  freezeId: number;

  @ManyToMany( type => Member, member => member.membershipPurchases)
  @JoinTable()
  members: Member[];

}
