import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SalesRoutingModule} from './sales-routing.module';
import {SharedModule} from '@shared/shared.module';
import {SalesComponent} from './sales.component';
import {MembershipCrudDialog} from './membership/membership-crud-dialog/membership-crud-dialog.component';
import {StockListComponent} from './stock/stock-list.component';
import {MembershipListComponent} from './membership/membership-list/membership-list.component';
import {StockCrudDialogComponent} from './stock/stock-crud-dialog/stock-crud-dialog.component';
import {StockPurchaseFormComponent} from './stock/stock-purchase-form/stock-purchase-form.component';
import {MembershipPurchaseFormComponent} from './membership/membership-purchase-form/membership-purchase-form.component';


@NgModule({
  declarations: [
    SalesComponent,
    MembershipCrudDialog,
    StockListComponent,
    MembershipListComponent,
    StockCrudDialogComponent,
    StockPurchaseFormComponent,
    MembershipPurchaseFormComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    SharedModule,
  ],

})
export class SalesModule {
}
