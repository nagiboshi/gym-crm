export interface Category {
  id: number;
  name: string;
  description: string;
  subcategories: Subcategory[];
  type: string;
}

export interface Subcategory {
  id: number;
  name: string;
  description: string;
  category: Category;
}
