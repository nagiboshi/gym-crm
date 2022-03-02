import {Injectable} from '@angular/core';
import {QueryJoin, RequestQueryBuilder} from '@nestjsx/crud-request';
import {Category, Subcategory} from '@models/category';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of, Subject, zip} from 'rxjs';
import {filter, map, mergeMap, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  subcategoryEdited: Subject<Subcategory>;
  subcategoryEdited$: Observable<Subcategory>;
  subcategoryAdded: Subject<Subcategory>;
  subcategoryAdded$: Observable<Subcategory>;
  categorySaved: Subject<Category>;
  categorySaved$: Observable<Category>;
  categories: BehaviorSubject<Category[]>;
  categories$: Observable<Category[]>;
  categoriesTypeService$: Observable<Category[]>;
  categoryEdited: Subject<Category>;
  categoryEdited$: Observable<Category>;
  constructor(private http: HttpClient) {
    this.subcategoryEdited = new Subject();
    this.subcategoryEdited$ = this.subcategoryEdited.asObservable();
    this.subcategoryAdded = new Subject();
    this.subcategoryAdded$ = this.subcategoryAdded.asObservable();
    this.categorySaved = new Subject();
    this.categorySaved$ = this.categorySaved.asObservable();
    this.categories = new BehaviorSubject([]);
    this.categories$ = this.categories.asObservable();
    this.categoriesTypeService$ =  this.categories$.pipe(map(c => c.filter( cat => cat.type == 'service')));
    this.categoryEdited = new Subject();
    this.categoryEdited$ = this.categoryEdited.asObservable();
  }

  fetchCategories() {
    const joinFields=  this.getCategoryJoinQuery();
    const requestBuild = RequestQueryBuilder.create();
    requestBuild.setJoin(joinFields)
      .setOr([
              {field:'type', operator: 'eq', value: 'service'},
              {field:'type', operator: 'eq', value: 'stock'}]);
      return this.http.get<Category[]>(`/api/category?${requestBuild.query(false)}`).pipe(tap((categories) => {
          this.categories.next(categories);
      }));
  }

  getCategories(type: 'stock'|'service'): Category[] {
    return this.categories.getValue().filter( c => c.type == type);
  }

  removeCategory(id: number): Promise<any> {
    return this.http.delete(`/api/category/${id}`).toPromise();
  }

  removeSubcategory(id: number) {
    return this.http.delete(`/api/subcategory/${id}`);
  }

  getCategoryJoinQuery(): Array<QueryJoin> {
    return [{field: 'subcategories'}];
  }

  getSubcategories(): Promise<Subcategory[]> {
    return this.http.get<Subcategory[]>(`/api/subcategory`).toPromise();
  }

  private updateCategory(updatedCategory: Category): Promise<Category> {
    const query = this.getCategoryJoinQuery();
    return this.http.patch<Category>(`/api/category/${updatedCategory.id}?${query}`, updatedCategory).toPromise();
  }

  mergeCategory(category: Category): Promise<Category> {
    if( category.id == 0 ) {
       return this.saveCategory(category).then((savedCategory) => {
            this.categorySaved.next(savedCategory);
            this.categories.next([savedCategory, ...this.categories.getValue()]);
            return savedCategory;
        });
    }

    return this.updateCategory(category).then((updatedCategory)=> {
      this.categoryEdited.next(updatedCategory);
      let existCategories = this.categories.getValue();
      let idx = existCategories.findIndex( c => c.id == updatedCategory.id);
      this.categories.next([...existCategories.splice(idx, 1, updatedCategory)]);
      return updatedCategory;
    });


  }

  private saveCategory(category: Category): Promise<Category> {
    const query = RequestQueryBuilder.create();
    query.setJoin(this.getCategoryJoinQuery());
    return this.http.post<Category>('/api/category?' + query.query(false), category).toPromise();
  }
}
