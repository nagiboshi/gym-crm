import {ServicePurchaseModel} from '@models/membership-purchase';

export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  photoLink: string;
  email: string;
  phoneNumber: string;
  gender: string;
  notes?: string;
  referalType?: string;
  referalMember?: Member;
  created: Date;
  membershipPurchases?: ServicePurchaseModel[];
  activeMembership: ServicePurchaseModel;
}
