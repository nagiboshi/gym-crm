import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Page} from '@models/page';
import {Product} from '@models/product';
import {CondOperator, QueryJoin, RequestQueryBuilder} from '@nestjsx/crud-request';
import {isEmpty} from 'lodash';
import {HttpClient} from '@angular/common/http';
import {InventoryItem} from './inventory-list/inventory-item';

@Injectable({providedIn: 'root'})
export class InventoryService  {
  private apiPath = '/api/inventory';

  constructor(private http: HttpClient) {
  }

  getItems(limit: number = 10, page: number = 0, name: string = '', joinFields: QueryJoin[] = []): Observable<Page<InventoryItem>> {
    const queryBuilder: RequestQueryBuilder = RequestQueryBuilder.create();
    if (!isEmpty(name)) {
      queryBuilder.setFilter({
        field: 'product.name',
        value: name,
        operator: CondOperator.CONTAINS
      });
    }

    queryBuilder.setJoin(joinFields);
    queryBuilder.sortBy({field: 'id', order: 'DESC'})

    queryBuilder.setLimit(limit);
    queryBuilder.setPage(page);
    queryBuilder.sortBy({field: 'id', order: 'DESC'})
    const path  = this.getQueryPath(queryBuilder);
    return this.http.get<Page<InventoryItem>>(`${this.apiPath}${path}`);
  }



  private getQueryPath(queryBuilder? :RequestQueryBuilder) {
    let queryPath = "";
    if(queryBuilder) {
      queryPath +=  `?${queryBuilder.query(false)}`;
    }
    return queryPath;
  }
}
