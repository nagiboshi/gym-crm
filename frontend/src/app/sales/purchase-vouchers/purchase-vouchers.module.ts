import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '@shared/shared.module';
import {PurchaseVouchersListComponent} from './puchase-vouchers-list/purchase-vouchers-list.component';
import { PurchaseVoucherCrudDialogComponent } from './purchase-voucher-crud-dialog/purchase-voucher-crud-dialog.component';
import {StockCrudDialogComponent} from './stock-crud-dialog/stock-crud-dialog.component';


@NgModule({
  declarations: [
    PurchaseVouchersListComponent,StockCrudDialogComponent, PurchaseVoucherCrudDialogComponent, PurchaseVoucherCrudDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    PurchaseVouchersListComponent
  ]
})
export class PurchaseVouchersModule {
}
