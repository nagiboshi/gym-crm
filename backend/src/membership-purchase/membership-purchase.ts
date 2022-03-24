import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PaymentMethod} from '../payment-method/payment-method';
import {MembershipFreeze} from './membership-freeze';
import {Member} from '../member/member';
import {Membership} from '../membership-group/membership';
import {Payment} from '../payments/payment';

export const MembershipPurchaseFields = {
  membership: 'membership',
  payments: 'payments'
}

@Entity()
export class MembershipPurchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: Date;

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
