import {Membership} from './membership';

export interface MembershipGroup {
  id: number;
  name: string;
  memberships: Membership[];
}
