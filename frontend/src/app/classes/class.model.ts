import {Category} from '@models/category';

export interface ClassModel {
  id: number;
  name: string;
  categoryId: number;
  category?: Category;
  branchId: number;
}

