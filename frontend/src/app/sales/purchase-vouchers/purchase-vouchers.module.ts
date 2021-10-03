import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PurchaseVouchersComponent} from './puchase-vouchers/purchase-vouchers.component';
import {SharedModule} from '@shared/shared.module';


@NgModule({
  declarations: [
    PurchaseVouchersComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    PurchaseVouchersComponent
  ]
})
export class PurchaseVouchersModule {
}
