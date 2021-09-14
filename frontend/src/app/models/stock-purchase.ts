import {Stock, StockPropertyValue} from '@models/stock';
import {PaymentMethod} from '@models/payment-method';


export class StockPurchase {
  id: number;
  saleDate: number;
  price: number;
  stock: Stock;
  quantity: number;
  stockId: number;
  paymentMethod: PaymentMethod;
  paymentMethodId: number;
  properties: StockPropertyValue[];

}
