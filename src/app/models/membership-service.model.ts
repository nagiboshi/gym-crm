import {MembershipItem} from './membership-item.model';

export interface MembershipService {
  id: number;
  name: string;
  items: MembershipItem[];
}
