import {Injectable} from '@angular/core';
import {Product} from '@models/product';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CondOperator, RequestQueryBuilder} from '@nestjsx/crud-request';
import {isEmpty} from 'lodash';
import {Page} from '@models/page';
import {CrudTableService} from '@shared/crud-table/crud-table.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends CrudTableService<Product>{
  static apiPath = '/api/product';
  constructor(public http: HttpClient) {
    super(ProductService.apiPath)
  }

  save(product: Product): Promise<Product> {
    const queryBuilder = RequestQueryBuilder.create();
    queryBuilder.setJoin({field: 'properties'});
    queryBuilder.setJoin({field: 'properties.values'});
    return super.save(product, queryBuilder);
  }

  get(id: number): Promise<any> {
    const queryBuilder: RequestQueryBuilder = RequestQueryBuilder.create();
    queryBuilder.setJoin({field: 'properties'})
    queryBuilder.setJoin({field: 'properties.values'});
    queryBuilder.setJoin({field: 'subcategory'});
    queryBuilder.setJoin({field: 'subcategory.category'});
    return super.get(id, queryBuilder);
  }

  getProducts(limit: number = 10, page: number = 0, name: string = ''): Observable<Page<Product>> {
    const queryBuilder: RequestQueryBuilder = RequestQueryBuilder.create();
    if (!isEmpty(name)) {
      queryBuilder.setFilter({
        field: 'name',
        value: name,
        operator: CondOperator.CONTAINS
      });
    }
    queryBuilder.sortBy({field: 'id', order: 'DESC'})

    return super.getPaged(limit,  page, queryBuilder);
  }

  getFullEntity(id: number) {
    return this.get(id);
  }

}
