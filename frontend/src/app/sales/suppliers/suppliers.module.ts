import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { SuppliersCrudComponent } from './suppliers-crud/suppliers-crud.component';
import {SharedModule} from '@shared/shared.module';
import { SupplierViewComponent } from './supplier-view/supplier-view.component';



@NgModule({
  declarations: [
    SupplierListComponent,
    SuppliersCrudComponent,
    SupplierViewComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    SupplierListComponent
  ]
})
export class SuppliersModule { }
