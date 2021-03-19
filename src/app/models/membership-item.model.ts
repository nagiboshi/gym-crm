export interface MembershipItem {
  id: number;
  isShared?: boolean;
  name: string;
  familySize?: number;
  expirationType: 'day'|'month'|'year';
  expirationLength: number;
}
