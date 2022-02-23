export interface PropertyValue {
  id: number;
  value: string;
  property?: Property;
  propertyId: number;
}

export interface Property {
  id: number;
  name: string;
  values: PropertyValue[];
}


export const emptyProperty = (): Property => {
  return {id: 0, values: [], name: ""};
}
