import { Injectable } from '@angular/core';
import {CrudTableService} from '@shared/crud-table/crud-table.service';
import {PurchaseVoucher} from './purchase-voucher';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PurchaseVouchersService extends CrudTableService<PurchaseVoucher>{
  static apiPath = '/api/purchase-voucher';
  constructor(public http: HttpClient) {
    super(PurchaseVouchersService.apiPath);
  }

  getFullEntity(id: number) {
  }
}
