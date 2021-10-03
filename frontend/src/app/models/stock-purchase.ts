import {Stock} from '@models/stock';
import {PaymentMethod} from '@models/payment-method';
import {PropertyValue} from '@models/property';


export class StockPurchase {
  id: number;
  saleDate: number;
  price: number;
  stock: Stock;
  quantity: number;
  stockId: number;
  paymentMethod: PaymentMethod;
  paymentMethodId: number;
  properties: PropertyValue[];

}
