import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProductCategory} from '@models/product-category';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {remove} from 'lodash';
import {Product} from '@models/product';
import {flatten} from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class ProductCategoriesService {
  productCategoriesSubj = new BehaviorSubject<ProductCategory[]>([]);
  productCategories$: Observable<ProductCategory[]> = this.productCategoriesSubj.asObservable();
  constructor(private httpClient: HttpClient) {

  }

  removeProductCategory(productCategory: ProductCategory) {
    this.httpClient.delete(`/api/productCategory/${productCategory.id}`).pipe(tap( _ => {
      const productCategories = this.productCategoriesSubj.getValue();
      remove(productCategories, p => p.id == productCategory.id);
      this.productCategoriesSubj.next([...productCategories]);
    })).subscribe();
  }

  fetchProductCategories(): Observable<ProductCategory[]> {
   return this.httpClient.get<ProductCategory[]>('/api/productCategory').pipe(tap(pproductCategories => this.productCategoriesSubj.next(pproductCategories)) );
  }

  saveProductCategory(productCategory: ProductCategory): Promise<ProductCategory> {
    return new Promise<ProductCategory>((resolve, reject) => {
      this.httpClient.post<ProductCategory>('/api/productCategory', productCategory).toPromise().then((mergedProductCategory) => {
        const productCategories = this.productCategoriesSubj.getValue();
        if (productCategory.id == 0) {
          this.productCategoriesSubj.next([mergedProductCategory, ...productCategories]);
        } else {
          const productIndex = productCategories.findIndex( p => p.id == productCategory.id);
          if( productIndex != -1 ) {
            productCategories[productIndex] = mergedProductCategory;
            this.productCategoriesSubj.next([...productCategories]);
          }
        }

        resolve(mergedProductCategory);
      }).catch( e => reject(e));
    });

  }


  getProductCategory$(): Observable<ProductCategory[]> {
    return this.productCategories$;
  }

  getProductCategories(): ProductCategory[] {
    return this.productCategoriesSubj.getValue();
  }

  getProducts(): Product[] {
    return flatten(this.productCategoriesSubj.getValue().map(p => {
      return p.products;
    } ));
  }


}
