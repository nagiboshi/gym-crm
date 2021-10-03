export interface PropertyValue {
  id: number;
  value: string;
  property?: Property;
}

export interface Property {
  id: number;
  name: string;
  values: PropertyValue[];
}
