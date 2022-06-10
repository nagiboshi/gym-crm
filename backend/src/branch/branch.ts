import {Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationOptions} from 'typeorm';
import {User} from '../user/user';
import {Member} from '../member/member';
import {ClassModel} from '../classes/class-model';
import {Category} from '../sales/category/category';
import {PurchaseVoucher} from '../sales/purchase-vouchers/purchase-voucher';
import {InventoryItem} from '../sales/inventory/inventory-item';
import {MembershipGroup} from '../membership-group/membership-group';
import {Company} from '../company/company';

@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(type => Company, company => company.branches)
  company: Company;

  @ManyToMany( type => User, user => user.branches)
  users: User[];

  @OneToMany( type => Member, member => member.branch, {orphanedRowAction: "delete"})
  members: Member[];

  @OneToMany( type => ClassModel, classModel => classModel.branch, {orphanedRowAction: "delete"})
  classes: ClassModel[];

  @OneToMany( type => Category, category => category.branch, {orphanedRowAction: "delete"})
  categories: Category[];

  @OneToMany( type => PurchaseVoucher,  purchaseVoucher => purchaseVoucher.branch, {orphanedRowAction: "delete"})
  purchaseVouchers: PurchaseVoucher[];

  @OneToMany( type => InventoryItem,  inventoryItem => inventoryItem.branch, {orphanedRowAction: "delete"})
  inventoryItems: InventoryItem[];

  @OneToMany( type => MembershipGroup,  membership => membership.branch, {orphanedRowAction: "delete"})
  membershipGroups: MembershipGroup[];
}
