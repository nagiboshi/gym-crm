
export interface ProductTag {
  id: number;
  name: string;
}

export interface ProductFieldOption {
  id: number;
  value: string;
  productField: ProductField;
}

export interface ProductCategory {
  id: number;
  name: string;
  description: string;
  subcategories: ProductSubcategory[];
}

export interface ProductSubcategory {
  id: number;
  name: string;
  description: string;
  category: ProductCategory;
}

export interface ProductField {
  id: number;
  name: string;
  options: ProductFieldOption[];
}

export interface Product {
  id: number;
  name: string;
  fields: ProductField[];
  price: number;
  photoLinks: string[];
  subcategory: ProductSubcategory;
  tags: ProductTag[]
}
