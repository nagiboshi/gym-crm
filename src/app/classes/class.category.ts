import {ClassModel} from './class.model';

export interface ClassCategory {
  id: number;
  name: string;
  classes: ClassModel[];
}
