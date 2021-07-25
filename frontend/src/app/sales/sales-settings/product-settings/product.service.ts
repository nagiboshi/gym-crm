import {Injectable} from '@angular/core';
import {Product, ProductCategory, ProductSubcategory} from '@models/product';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {CondOperator, RequestQueryBuilder} from '@nestjsx/crud-request';
import {isEmpty} from 'lodash';
import {tap} from 'rxjs/operators';
import {Page} from '@models/page';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productCategories: BehaviorSubject<ProductCategory[]> = new BehaviorSubject([]);

  constructor(private http: HttpClient) {
  }

  fetchProductCategories(): Observable<ProductCategory[]> {
    const query = RequestQueryBuilder.create().setJoin({field: 'subcategories'}).query(false);
    return this.http.get<ProductCategory[]>(`/api/product-category?${query}`).pipe(tap(fetchedProductCategories => this.productCategories.next(fetchedProductCategories)));
  }

  removeCategory(id: number) {
    return this.http.delete(`/api/product-category/${id}`).pipe(tap(_ => {
      const categoriesCache = this.productCategories.getValue();
      const categoryIndex = categoriesCache.findIndex(cat => cat.id == id);
      if (categoryIndex != -1) {
        categoriesCache.splice(categoryIndex, 1);
        this.productCategories.next([...categoriesCache]);
      }
    }));
  }

  removeSubcategory(id: number) {
    return this.http.delete(`/api/product-subcategory/${id}`).pipe(tap(_ => {
      const categoriesCache = this.productCategories.getValue();
      categoriesCache.forEach((category) => {
        const subcatIndex = category.subcategories.findIndex(subcat => subcat.id == id);
        if (subcatIndex != -1) {
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

  async saveProduct(product: Product): Promise<Product> {
    const queryBuilder = RequestQueryBuilder.create();
    queryBuilder.setJoin({field: 'fields'});
    queryBuilder.setJoin({field: 'fields.options'});
    queryBuilder.setJoin({field: 'tags'});
    return await this.http.post<Product>('/api/product?' + queryBuilder.query(false), product).toPromise();
  }

  // getProducts(): Observable<Page<Product>>;

  getProducts(limit: number = 10, page: number = 0, name: string = ''): Observable<Page<Product>> {
    const queryBuilder: RequestQueryBuilder = RequestQueryBuilder.create();

    if (limit) {
      queryBuilder.setLimit(limit);
    }


    if (page) {
      queryBuilder.setPage(page);
    }

    queryBuilder.setJoin({field: 'fields'});
    queryBuilder.setJoin({field: 'fields.options'});
    queryBuilder.setJoin({field: 'tags'});

    if (!isEmpty(name)) {
      queryBuilder.setFilter({
        field: 'name',
        value: name,
        operator: CondOperator.CONTAINS
      });
    }

    queryBuilder.sortBy({field: 'id', order: 'DESC'})

    return this.http.get<Page<Product>>(`/api/product?` + queryBuilder.query(false));
  }

  remove(id: number);

  remove(product: Product);

  remove(productOrId: Product | number) {
    if (typeof productOrId == 'number') {
      return this.http.delete(`/api/product/` + productOrId,);
    }
    return this.http.delete(`/api/product/` + productOrId.id);
  }

  getCategories(): ProductCategory[] {
    return this.productCategories.getValue();
  }

  getSubcategories(): ProductSubcategory[] {
    return this.productCategories.getValue().map(c => c.subcategories).reduce((accumulator, currentValue) => {
      return [...accumulator, ...currentValue];
    });
  }


}
