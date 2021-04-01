import {PackageItem} from './package-item';

export interface Package {
  id: number;
  name: string;
  items: PackageItem[];
}
