import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {CrudTableComponent} from '@shared/crud-table/crud-table.component';
import {PurchaseVoucher} from '@models/purchase-voucher';
import {PurchaseVouchersService} from '../purchase-vouchers.service';
import {MatDialog} from '@angular/material/dialog';
import {PurchaseVoucherCrudDialogComponent} from '../purchase-voucher-crud-dialog/purchase-voucher-crud-dialog.component';
import * as _moment from 'moment';
import {VoucherReceiptViewerComponent} from '../voucher-receipt-viewer/voucher-receipt-viewer.component';
let moment  = _moment;
@Component({
  selector: 'purchase-vouchers',
  templateUrl: './purchase-vouchers-list.component.html',
  styleUrls: ['./purchase-vouchers-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PurchaseVouchersListComponent extends CrudTableComponent<PurchaseVouchersService, PurchaseVoucher, PurchaseVoucherCrudDialogComponent> {
  limit = 10;
  columns = ['name', 'from', 'to', 'receipt', 'edit', 'delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog, private purchaseVouchersService: PurchaseVouchersService) {
    super(purchaseVouchersService, PurchaseVoucherCrudDialogComponent);
  }

  ngOnInit() {
    super.init();
  }

  _newTableEntity(): PurchaseVoucher {
     return {id: 0, from: moment.now(), items: [], to: null, supplier: null};
  }

  async showReceipt(row: Partial<PurchaseVoucher>) {
    const id = row.id;
    const purchaseVoucher =  await this.purchaseVouchersService.getFullEntity(id);
    this.dialog.open(VoucherReceiptViewerComponent, {width: '50%' , height: '80%' ,data: purchaseVoucher} );
  }

}
