import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '@shared/shared.module';
import {PurchaseVouchersListComponent} from './puchase-vouchers-list/purchase-vouchers-list.component';
import { PurchaseVoucherCrudDialogComponent } from './purchase-voucher-crud-dialog/purchase-voucher-crud-dialog.component';
import {ProductCrudDialogComponent} from './product-crud-dialog/product-crud-dialog.component';
import { VoucherReceiptViewerComponent } from './voucher-receipt-viewer/voucher-receipt-viewer.component';
import { VoucherItemComponent } from './voucher-item/voucher-item.component';


@NgModule({
  declarations: [
    PurchaseVouchersListComponent,ProductCrudDialogComponent, PurchaseVoucherCrudDialogComponent, PurchaseVoucherCrudDialogComponent, VoucherReceiptViewerComponent, VoucherItemComponent
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
