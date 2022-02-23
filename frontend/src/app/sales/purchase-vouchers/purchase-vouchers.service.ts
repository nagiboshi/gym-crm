import { Injectable } from '@angular/core';
import {CrudTableService} from '@shared/crud-table/crud-table.service';
import {PurchaseVoucher} from '@models/purchase-voucher';
import {HttpClient} from '@angular/common/http';
import {RequestQueryBuilder} from '@nestjsx/crud-request';
import {Observable} from 'rxjs';
import {Page} from '@models/page';

@Injectable({
  providedIn: 'root'
})
export class PurchaseVouchersService extends CrudTableService<PurchaseVoucher>{
  static apiPath = '/api/purchase-voucher';
  constructor(public http: HttpClient) {
    super(PurchaseVouchersService.apiPath);
  }

  getPaged(limit: number = 10, page: number = 0, queryBuilder?: RequestQueryBuilder): Observable<Page<PurchaseVoucher>> {
    queryBuilder = RequestQueryBuilder.create();
    queryBuilder.setJoin({field: 'supplier'});
    return super.getPaged(limit, page, queryBuilder);
  }

  getFullEntity(id: number): Promise<PurchaseVoucher> {
    const queryBuilder = RequestQueryBuilder.create();
    queryBuilder.setJoin({field: 'supplier' });
    queryBuilder.setJoin({field: 'items'});
    queryBuilder.setJoin({field: 'items.product'});
    queryBuilder.setJoin({field: 'items.details'});
    const query  = '?' + queryBuilder.query(false);
    return this.http.get<PurchaseVoucher>(`${PurchaseVouchersService.apiPath}/${id}${query}`).toPromise();
  }
}
