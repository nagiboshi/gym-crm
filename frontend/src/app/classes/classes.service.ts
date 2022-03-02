import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ClassModel} from './class.model';
import {HttpClient} from '@angular/common/http';
import {remove} from 'lodash';
  import {Category} from '@models/category';
import {CategoryService} from '@shared/category/category.service';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  classesSubj = new BehaviorSubject<ClassModel[]>([]);
  classes$ = this.classesSubj.asObservable();

  constructor(private httpClient: HttpClient, private categoryService: CategoryService) { }

  getCategories(): Category[] {
    return this.categoryService.getCategories('service');
  }

  getClasses(): ClassModel[] {
    return this.classesSubj.getValue();
  }

  fetchClasses(): Observable<ClassModel[]> {
    return this.httpClient.get<ClassModel[]>('/api/classes').pipe(tap((classes) => {
      this.classesSubj.next(classes);
    }));
  }

  removeClass(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.httpClient.delete(`/api/classes/${id}`).toPromise().then(() => {
        const filteredClasses = this.classesSubj.getValue();
        remove(filteredClasses, c => c.id == id);
        this.classesSubj.next([...filteredClasses]);
        resolve();
      });
    });
  }

  addClass(newClass: ClassModel): Promise<ClassModel> {
    return new Promise<ClassModel>((resolve, reject) => {
      this.httpClient.post<ClassModel>('/api/classes', newClass).toPromise().then((addedClass) => {
        if (newClass.id == 0) {
          this.classesSubj.next([addedClass, ...this.classesSubj.getValue()]);
        } else {
          const classes = this.classesSubj.getValue();
          const index = classes.findIndex(c => c.id == newClass.id);
          if (index != -1) {
            classes[index] = addedClass;
          }

          this.classesSubj.next([...classes]);
        }
        resolve(addedClass);
      }).catch((e) => {
        reject(e);
      });

    });
  }
}
