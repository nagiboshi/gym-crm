import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PaymentMethod} from '../payment-method/payment-method';
import {MembershipFreeze} from './membership-freeze';
import {Member} from '../member/member';
import {Membership} from '../membership-group/membership';

export const MembershipPurchaseFields = {
  membership: 'membership'
}

@Entity()
export class MembershipPurchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  saleDate: Date;

  @Column()
  startDate: Date;

  @Column()
  price: number;

  @Column()
  note: string;

  @ManyToOne(type => Membership, {onDelete: "CASCADE"})
  @JoinColumn({name: 'membershipId', referencedColumnName: 'id'})
  membership: Membership;

  @Column()
  membershipId: number;

  @ManyToOne( type => PaymentMethod)
  @JoinColumn({name: 'paymentMethodId', referencedColumnName: 'id'})
  paymentMethod: PaymentMethod;

  @Column()
  paymentMethodId: number;

  @OneToOne(type => MembershipFreeze, {nullable: true, cascade: true})
  @JoinColumn({name: 'freezeId'})
  freeze: MembershipFreeze;

  @Column({nullable: true})
  freezeId: number;

  @ManyToMany( type => Member, member => member.membershipPurchases)
  @JoinTable()
  members: Member[];

}
