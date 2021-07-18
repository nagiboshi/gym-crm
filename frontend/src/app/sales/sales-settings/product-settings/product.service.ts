import { Injectable } from '@angular/core';
import {Product, ProductCategory, ProductSubcategory} from '@models/product';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {CondOperator, RequestQueryBuilder} from '@nestjsx/crud-request';
import {isEmpty} from 'lodash';
import {tap} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productCategories: BehaviorSubject<ProductCategory[]> = new BehaviorSubject([]);
  constructor(private http: HttpClient) { }

  fetchProductCategories(): Observable<ProductCategory[]> {
  const query = RequestQueryBuilder.create().setJoin({field: 'subcategories'}).query(false);
  return this.http.get<ProductCategory[]>(`/api/product-category?${query}`).pipe(tap(fetchedProductCategories => this.productCategories.next(fetchedProductCategories)));
  }

  removeCategory(id: number) {
    return this.http.delete(`/api/product-category/${id}`).pipe( tap(_ => {
      const categoriesCache = this.productCategories.getValue();
      const categoryIndex = categoriesCache.findIndex( cat => cat.id == id);
      if( categoryIndex != -1 ) {
        categoriesCache.splice(categoryIndex, 1);
        this.productCategories.next([...categoriesCache]);
      }
    }));
  }

  removeSubcategory(id: number) {
    return this.http.delete(`/api/product-subcategory/${id}`).pipe(tap( _ => {
         const categoriesCache = this.productCategories.getValue();
         categoriesCache.forEach( (category) => {
           const subcatIndex = category.subcategories.findIndex( subcat => subcat.id == id);
           if( subcatIndex != -1 ) {
             category.subcategories.splice(subcatIndex, 1);
           }
         });
         this.productCategories.next(categoriesCache);
    }));
  }

  saveCategory(productCategory: ProductCategory) {
    const query = RequestQueryBuilder.create().setJoin({field: 'subcategories'}).query(false);
    return this.http.post<ProductCategory>('/api/product-category?' + query, productCategory).pipe(tap(productCategory => {
      this.productCategories.next([productCategory, ...this.productCategories.getValue()]);
    }));
  }

  save(product: Product) {

  }

  getProducts(): Observable<Product[]>;

  getProducts(limit: number = 10, page: number = 0, name:string = "" ): Observable<Product[]> {
    const queryBuilder: RequestQueryBuilder = RequestQueryBuilder.create();
    if( limit ) {
      queryBuilder.setLimit(limit);
    }

    if( page ) {
      queryBuilder.setPage(page);
    }

    if( !isEmpty(name)) {
      queryBuilder.setFilter({
        field: 'name',
        value: name,
        operator: CondOperator.CONTAINS
      })

    }
    return this.http.get<Product[]>(`/api/product/?` + queryBuilder.query(false) );
  }

  remove(id: number);

  remove(product: Product);

  remove(productOrId: Product | number) {
    if( typeof productOrId == 'number' ) {
      return this.http.delete(`/api/product/` + productOrId,)
    }
    return this.http.delete(`/api/product/` + productOrId.id);
  }

  getCategories(): ProductCategory[] {
    return this.productCategories.getValue();
  }

  getSubcategories(): ProductSubcategory[] {
    return this.productCategories.getValue().map( c => c.subcategories).reduce( (accumulator, currentValue) => {
        return [...accumulator, ...currentValue];
    })
  }


}
