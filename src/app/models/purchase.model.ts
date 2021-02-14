import {MembershipItem} from './membership-item.model';
import {Member} from './member.model';

export interface PurchaseItem {
  id: number;
  item: MembershipItem;
  qty: number;
  discountId?: number;
  memberId: number;
}
