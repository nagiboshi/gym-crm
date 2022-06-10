import {Company} from '@models/company';

export interface Branch {
  id: number;
  name: string;
  company?: Company;
}
