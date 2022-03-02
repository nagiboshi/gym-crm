import {Property} from '@models/property';

export interface Category {
  id: number;
  name: string;
  subcategories?: Subcategory[];
  type: 'stock' | 'service';
}

export interface Subcategory {
  id: number;
  name: string;
  category?: Category;
  categoryId: number;
  properties?: Property[];
}

export const emptyCategory = (type: 'stock' | 'service'): Category => { return {id: 0, name: '', subcategories: [], type:type}};

export const emptySubcategory = (category: Category) => {return {id: 0, name: '', category, categoryId: category.id}};
