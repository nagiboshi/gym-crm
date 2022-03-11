export interface PurchaseFreeze {
  id: number;
  purchaseId: number;
  startDate: Date;
  endDate?: Date;
  totalDays?: number;
  note?: string;
}
