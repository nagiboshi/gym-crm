import {License} from '@models/license';

export interface Company {
  id: number;
  name: string;
  license: License;
}
