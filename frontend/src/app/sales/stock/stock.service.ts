import {Injectable} from '@angular/core';
import {Stock} from '@models/stock';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CondOperator, QueryJoin, RequestQueryBuilder} from '@nestjsx/crud-request';
import {isEmpty} from 'lodash';
import {Page} from '@models/page';
import {StockPurchase} from '@models/stock-purchase';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private http: HttpClient) {
  }

  async saveStock(stock: Stock): Promise<Stock> {
    const queryBuilder = RequestQueryBuilder.create();

    return await this.http.post<Stock>('/api/stock?' + queryBuilder.query(false), stock).toPromise();
  }

  sellStock(purchase: StockPurchase): Promise<StockPurchase> {
    return this.http.post<StockPurchase>('/api/stock-purchase', purchase).toPromise();
  }

  updateStock(id: number, stockUpdate: Partial<Stock>): Promise<Stock> {
    return this.http.patch<Stock>(`/api/stock/${id}`, stockUpdate ).toPromise();
  }

  getStockWithProperties(id: number) {
    const queryBuilder: RequestQueryBuilder = RequestQueryBuilder.create();
    queryBuilder.setJoin({field: 'properties'});
    queryBuilder.setJoin({field: 'properties.values'});
    return this.http.get<Stock>(`/api/stock/${id}?` + queryBuilder.query(false));
  }

  getStocks(limit: number = 10, page: number = 0, name: string = '', joinFields?: QueryJoin[] ): Observable<Page<Stock>> {
    const queryBuilder: RequestQueryBuilder = RequestQueryBuilder.create();

    if (limit) {
      queryBuilder.setLimit(limit);
    }


    if (page) {
      queryBuilder.setPage(page);
    }

    if( joinFields ) {
      joinFields.forEach( jf => queryBuilder.setJoin(jf));
    }

    if (!isEmpty(name)) {
      queryBuilder.setFilter({
        field: 'name',
        value: name,
        operator: CondOperator.CONTAINS
      });
    }

    queryBuilder.sortBy({field: 'id', order: 'DESC'})

    return this.http.get<Page<Stock>>(`/api/stock?` + queryBuilder.query(false));
  }

  remove(id: number);

  remove(stock: Stock);

  remove(stockOrId: Stock | number) {
    if (typeof stockOrId == 'number') {
      return this.http.delete(`/api/stock/` + stockOrId,).toPromise();
    }
    return this.http.delete(`/api/stock/` + stockOrId.id).toPromise();
  }


}
