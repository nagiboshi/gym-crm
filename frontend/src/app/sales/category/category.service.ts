import {Injectable} from '@angular/core';
import {RequestQueryBuilder} from '@nestjsx/crud-request';
import {Category, Subcategory} from '@models/category';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  subcategoryEdited: Subject<Subcategory>;
  subcategoryEdited$: Observable<Subcategory>;
  subcategoryAdded: Subject<Subcategory>;
  subcategoryAdded$: Observable<Subcategory>;

  constructor(private http: HttpClient) {
    this.subcategoryEdited = new Subject();
    this.subcategoryEdited$ = this.subcategoryEdited.asObservable();
    this.subcategoryAdded = new Subject();
    this.subcategoryAdded$ = this.subcategoryAdded.asObservable();
  }


  getCategories(): Promise<Category[]> {
    const query = this.getCategoryJoinQuery();
    return this.http.get<Category[]>(`/api/category?${query}`).toPromise();
  }

  removeCategory(id: number): Promise<any> {
    return this.http.delete(`/api/category/${id}`).toPromise();
  }

  removeSubcategory(id: number) {
    return this.http.delete(`/api/subcategory/${id}`);
  }

  getCategoryJoinQuery() {
    return RequestQueryBuilder.create().setJoin({field: 'subcategories'})
      .setJoin({field: 'subcategories.properties'}).setJoin({field: 'subcategories.properties.values'}).query(false);
  }

  getSubcategories(): Promise<Subcategory[]> {
    return this.http.get<Subcategory[]>(`/api/subcategory`).toPromise();
  }

  updateCategory(updatedCategory: Category): Promise<Category> {
    const query = this.getCategoryJoinQuery();
    return this.http.patch<Category>(`/api/category/${updatedCategory.id}?${query}`, updatedCategory).toPromise();
  }

  saveCategory(category: Category): Promise<Category> {
    const query = this.getCategoryJoinQuery();
    return this.http.post<Category>('/api/category?' + query, category).toPromise();
  }
}
