

export interface Membership {
  id: number;
  isShared?: boolean;
  numberOfParticipants?: number;
  name: string;
  expirationType?: 'day'|'month'|'year';
  expirationLength?: number;
}
