import {MembershipItem} from './membership-item.model';
import {Freeze} from './freeze.model';

export interface PurchaseItem {
  id: number;
  item: MembershipItem;
  saleDate: number;
  startDate: number;
  price: number;
  note: string;
  freezes?: Freeze[];
  memberId: number;
}
