import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SalesRoutingModule} from './sales-routing.module';
import {SharedModule} from '@shared/shared.module';
import {MembershipCrudDialog} from './membership/membership-crud-dialog/membership-crud-dialog.component';
import {MembershipListComponent} from './membership/membership-list/membership-list.component';
import {ServicePurchaseFormComponent} from './membership/service-purchase-form/service-purchase-form.component';
import {SuppliersModule} from './suppliers/suppliers.module';
import {PurchaseVouchersModule} from './purchase-vouchers/purchase-vouchers.module';
import {ProductModule} from './product/product.module';
import { InventoryListComponent } from './invetory/inventory-list/inventory-list.component';
import {InventoryPropertiesPipe} from './invetory/properties.pipe';
import {RouterModule} from '@angular/router';
import {PurchaseVouchersListComponent} from './purchase-vouchers/puchase-vouchers-list/purchase-vouchers-list.component';
import {SupplierListComponent} from './suppliers/supplier-list/supplier-list.component';
import {CategoryListComponent} from '@shared/category/category-list.component';
import {MemberSaleDialogComponent} from './member-sale-dialog/member-sale-dialog.component';
import {ClassesModule} from '../classes/classes.module';

@NgModule({
  declarations: [
    MembershipCrudDialog,
    MembershipListComponent,
    ServicePurchaseFormComponent,
    InventoryListComponent,
    InventoryPropertiesPipe,
    MemberSaleDialogComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    SharedModule,
    ClassesModule,
    ProductModule,
    PurchaseVouchersModule,
    SuppliersModule,
    RouterModule.forChild([
      {path: 'inventory', component: InventoryListComponent},
      {path: 'purchase-voucher', component: PurchaseVouchersListComponent},
      {path: 'memberships', component: MembershipListComponent},
      {path: 'suppliers', component: SupplierListComponent},
      {path: 'categories', component: CategoryListComponent},
    ])
  ],
  exports: [
    ServicePurchaseFormComponent
  ],
  providers: []

})
export class SalesModule {
}
