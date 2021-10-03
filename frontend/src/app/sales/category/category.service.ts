import {Injectable} from '@angular/core';
import {RequestQueryBuilder} from '@nestjsx/crud-request';
import {tap} from 'rxjs/operators';
import {Category, Subcategory} from '@models/category';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) {
  }


  getCategories(): Promise<Category[]> {
    const query = RequestQueryBuilder.create().setJoin({field: 'subcategories'}).query(false);
    return this.http.get<Category[]>(`/api/category?${query}`).toPromise();
  }

  removeCategory(id: number): Promise<any> {
    return this.http.delete(`/api/category/${id}`).toPromise();
  }

  removeSubcategory(id: number) {
    return this.http.delete(`/api/subcategory/${id}`);
  }


  getSubcategories(): Promise<Subcategory[]> {
    return this.http.get<Subcategory[]>(`/api/subcategory`).toPromise();
  }

  saveCategory(category: Category): Promise<Category> {
    const query = RequestQueryBuilder.create().setJoin({field: 'subcategories'}).query(false);
    return this.http.post<Category>('/api/category?' + query, category).toPromise();
  }
}
