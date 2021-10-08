import {Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {CrudTableComponent} from '@shared/crud-table/crud-table.component';
import {PurchaseVoucher} from '../purchase-voucher';
import {PurchaseVouchersService} from '../purchase-vouchers.service';
import {MatDialog} from '@angular/material/dialog';
import {PurchaseVoucherCrudDialogComponent} from '../purchase-voucher-crud-dialog/purchase-voucher-crud-dialog.component';

@Component({
  selector: 'purchase-vouchers',
  templateUrl: './purchase-vouchers-list.component.html',
  styleUrls: ['./purchase-vouchers-list.component.scss']
})
export class PurchaseVouchersListComponent extends CrudTableComponent<PurchaseVouchersService, PurchaseVoucher, PurchaseVoucherCrudDialogComponent> {
  limit = 10;
  columns = ['name', 'edit', 'delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog, private purchaseService: PurchaseVouchersService) {
    super(purchaseService, PurchaseVoucherCrudDialogComponent);
  }

  ngOnInit() {
    // const vouchers: PurchaseVoucher[] = [{id: 1, from: new Date().getTime(), to: null, stocks: []}];
    // super.dataSource.data = vouchers;
  }

  _newTableEntity(): PurchaseVoucher {
    return {id: 0, from: null, qty:0, stocks: [], to: null, supplier: null};
  }


}
