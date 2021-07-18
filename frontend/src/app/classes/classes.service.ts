import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {ClassModel} from './class.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {remove} from 'lodash';
import {tap} from 'rxjs/operators';
import {ClassCategory} from './class.category';
import {MembershipGroup} from '@models/membership-group';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  classesSubj = new BehaviorSubject<ClassModel[]>([]);
  classes$ = this.classesSubj.asObservable();
  classCategoriesSubj = new BehaviorSubject<ClassCategory[]>([]);

  constructor(private httpClient: HttpClient) { }

  fetchClasses(): Observable<ClassModel[]> {
    return this.httpClient.get<ClassModel[]>('/api/classes').pipe(tap( classes  => {
      this.classesSubj.next(classes);
    }));
  }


  fetchClassCategories(): Observable<ClassCategory[]> {
   return this.httpClient.get<ClassCategory[]>('/api/class-category').pipe(tap( classCategories => {
      this.classCategoriesSubj.next(classCategories);
    }));
  }

  getClassCategories(): ClassCategory[] {
    return this.classCategoriesSubj.getValue();
  }

  getClasses(): ClassModel[] {
    return this.classesSubj.getValue();
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
