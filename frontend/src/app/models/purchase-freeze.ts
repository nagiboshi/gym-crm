export interface PurchaseFreeze {
  id: number;
  purchaseId: number;
  startDate: number;
  endDate?: number;
  totalDays?: number;
  note?: string;
}
