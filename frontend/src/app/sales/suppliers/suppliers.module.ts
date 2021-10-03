import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { SuppliersCrudComponent } from './suppliers-crud/suppliers-crud.component';
import {SharedModule} from '@shared/shared.module';



@NgModule({
  declarations: [
    SupplierListComponent,
    SuppliersCrudComponent
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
