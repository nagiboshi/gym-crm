import {HttpClient} from '@angular/common/http';
import {RequestQueryBuilder} from '@nestjsx/crud-request';
import {Observable} from 'rxjs';
import {Page} from '@models/page';

export type Entity = {id: number};
export abstract class CrudTableService<T extends Entity> {
  abstract http: HttpClient;
  constructor(private readonly apiPath, ) {
  }

  private getQueryPath(queryBuilder? :RequestQueryBuilder) {
    let queryPath = "";
    if(queryBuilder) {
      queryPath +=  `?${queryBuilder.query(false)}`;
    }
    return queryPath;
  }

  async save(entity: T, queryBuilder?: RequestQueryBuilder ): Promise<T> {
    if( entity.id != 0 ) {
      return this.http.patch<T>(`${this.apiPath}/${entity.id}${this.getQueryPath(queryBuilder)}`, entity).toPromise();
    }
    return this.http.post<T>(`${this.apiPath}${this.getQueryPath(queryBuilder)}`, entity).toPromise();
  }

  get(id: number, queryBuilder?: RequestQueryBuilder ): Promise<T> {
      return this.http.get<T>(`${this.apiPath}/${id}${this.getQueryPath(queryBuilder)}`).toPromise();
  }

  abstract getFullEntity(id: number);

  getPaged(limit: number = 10, page: number = 0, queryBuilder?: RequestQueryBuilder): Observable<Page<T>> {
    if( !queryBuilder ) {
      queryBuilder = RequestQueryBuilder.create();
    }
    queryBuilder.setLimit(limit);
    queryBuilder.setPage(page);
    queryBuilder.sortBy({field: 'id', order: 'DESC'})
    const path  = this.getQueryPath(queryBuilder);
    return this.http.get<Page<T>>(`${this.apiPath}${path}`);
  }

  remove(id: number);

  remove(entity: T);

  remove(entityOrId: T | number) {
    if (typeof entityOrId == 'number') {
      return this.http.delete(`${this.apiPath}/${entityOrId}` + entityOrId,);
    }
    return this.http.delete(`${this.apiPath}/${entityOrId.id}`);
  }
}
