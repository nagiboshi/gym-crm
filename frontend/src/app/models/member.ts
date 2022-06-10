import {MembershipPurchaseModel} from '@models/membership-purchase';

export interface SocialNetworkAccount {
  id: number;
  address: string;
}

export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  photoLink: string;
  email: string;
  phoneNumber: string;
  emergencyPhone: string;
  gender: string;
  notes?: string;
  referalType?: string;
  referalMember?: Member;
  socialAccounts?: SocialNetworkAccount[];
  dob: Date;
  created: Date;
  type: 'local'|'shared';
  membershipPurchases?: MembershipPurchaseModel[];
  activeMembership: MembershipPurchaseModel;
}
