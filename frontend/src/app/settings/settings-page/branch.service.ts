import { Injectable } from '@angular/core';
import {CrudTableService} from '@shared/crud-table/crud-table.service';
import {Branch} from '@models/branch';
import {BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BranchService extends CrudTableService<Branch>{
static apiPath = '/api/branch';

  branchesSubj = new BehaviorSubject<Branch[]>([]);


  fetchBranches() {
    return this.http.get<Branch[]>('/api/branch').pipe(tap(branches => {
      this.branchesSubj.next(branches);
    }));
  }

  getBranches(): Branch[] {
    return this.branchesSubj.getValue();
  }

  getFullEntity(id: number) {
    this.get(id);
  }

  constructor( public http: HttpClient ) {
    super(BranchService.apiPath);
  }

}
