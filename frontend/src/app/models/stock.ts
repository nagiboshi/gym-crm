

export interface StockPropertyValue {
  id: number;
  value: string;
  property: StockProperty;
}

export interface StockProperty {
  id: number;
  name: string;
  values: StockPropertyValue[];
}

export interface Stock {
  id: number;
  name: string;
  properties: StockProperty[];
  price: number;
  qty: number;
}
