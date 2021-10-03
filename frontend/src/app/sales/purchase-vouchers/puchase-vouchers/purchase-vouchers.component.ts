import { Component, OnInit } from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {PurchaseVoucher} from './purchase-voucher'
import {PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'purchase-vouchers',
  templateUrl: './purchase-vouchers.component.html',
  styleUrls: ['./purchase-vouchers.component.scss']
})
export class PurchaseVouchersComponent implements OnInit {
  dataSource: DataSource<PurchaseVoucher>;
  vouchersPerPage = 5;
  columns: string[] = ['supplier'];

  constructor() { }

  ngOnInit(): void {
    // this.dataSource = new MatTableDataSource<PurchaseVoucher>([{id: 0, from: Date.now(), qty: 5, stocks: }]);
  }

  openDeletePromptDialog(purchaseVoucher: PurchaseVoucher) {

  }

  onChangePage($event: PageEvent) {

  }

  openCrudDialog() {

  }
}
