import {Property} from '@models/property';

export interface Supplier {
  id: number;
  name: string;
  properties: Property[];
}
