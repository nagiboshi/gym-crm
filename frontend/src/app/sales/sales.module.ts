import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SalesRoutingModule} from './sales-routing.module';
import {SalesSettingsComponent} from './sales-settings/sales-settings.component';
import {SharedModule} from '@shared/shared.module';
import {ProductSettingsComponent} from './sales-settings/product-settings/product-settings.component';
import {MembershipListComponent} from './sales-settings/membership-settings/membership-list/membership-list.component';
import {MembershipCrudDialog} from './sales-settings/membership-settings/membership-crud-dialog/membership-crud-dialog.component';
import {ProductCrudDialogComponent} from './sales-settings/product-settings/product-crud-dialog/product-crud-dialog.component';
import { ProductCategoriesComponent } from './sales-settings/product-categories/product-categories.component';
import { ProductCategoriesCrudComponent } from './sales-settings/product-categories/product-categories-crud/product-categories-crud.component';


@NgModule({
  declarations: [
    SalesSettingsComponent, MembershipCrudDialog, ProductSettingsComponent, MembershipListComponent, ProductCrudDialogComponent, ProductCategoriesComponent, ProductCategoriesCrudComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    SharedModule,
  ],

})
export class SalesModule {
}
