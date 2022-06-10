import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SalesRoutingModule} from './sales-routing.module';
import {SharedModule} from '@shared/shared.module';
import {MembershipCrudDialog} from './membership/membership-crud-dialog/membership-crud-dialog.component';
import {MembershipListComponent} from './membership/membership-list/membership-list.component';
import {ServicePurchaseFormComponent} from './membership/service-purchase-form/service-purchase-form.component';
import {SuppliersModule} from './suppliers/suppliers.module';
import {PurchaseVouchersModule} from './purchase-vouchers/purchase-vouchers.module';
import { InventoryListComponent } from './invetory/inventory-list/inventory-list.component';
import {InventoryPropertiesPipe} from './invetory/properties.pipe';
import {RouterModule} from '@angular/router';
import {PurchaseVouchersListComponent} from './purchase-vouchers/puchase-vouchers-list/purchase-vouchers-list.component';
import {SupplierListComponent} from './suppliers/supplier-list/supplier-list.component';
import {CategoryListComponent} from '@shared/category/category-list.component';
import {MemberSaleDialogComponent} from './member-sale-dialog/member-sale-dialog.component';
import {ClassesModule} from '../classes/classes.module';
import { PaymentComponent } from './payment/payment.component';
import {PaymentFinalizationDialogComponent} from './payment-finalization-dialog/payment-finalization-dialog.component';
import { MembershipPurchaseDialogComponent } from './membership/membership-purchase-dialog/membership-purchase-dialog.component';
import {StockPurchaseFormComponent} from './product/product-purchase-form/stock-purchase-form.component';
import {ViewItemComponent} from './product/view-product/view-item.component';
import {StockPurchaseFormDialogComponent} from './product/stock-purchase-form-dialog/stock-purchase-form-dialog.component';
import {ProductService} from './product/product.service';
import { ComaSeparatedMembershipPipe } from './membership/membership-list/coma-separated-membership.pipe';

@NgModule({
  declarations: [
    MembershipCrudDialog,
    MembershipListComponent,
    ServicePurchaseFormComponent,
    InventoryListComponent,
    InventoryPropertiesPipe,
    PaymentFinalizationDialogComponent,
    MemberSaleDialogComponent,
    PaymentComponent,
    MembershipPurchaseDialogComponent,
    StockPurchaseFormComponent,
    ViewItemComponent,
    StockPurchaseFormDialogComponent,
    ComaSeparatedMembershipPipe,
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    SharedModule,
    ClassesModule,
    PurchaseVouchersModule,
    SuppliersModule,
    RouterModule.forChild([
      {path: 'inventory', component: InventoryListComponent},
      {path: 'purchase-voucher', component: PurchaseVouchersListComponent},
      {path: 'memberships', component: MembershipListComponent},
      {path: 'suppliers', component: SupplierListComponent},
      {path: 'categories', component: CategoryListComponent, data: {type: 'stock'}},
    ])
  ],
  exports: [
    ServicePurchaseFormComponent,
    PaymentComponent,
    PaymentFinalizationDialogComponent
  ],
  providers: []

})
export class SalesModule {
}
