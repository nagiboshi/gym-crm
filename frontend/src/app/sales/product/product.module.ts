import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductListComponent} from './product-list/product-list.component';
import {ProductCrudDialogComponent} from './product-list/product-crud-dialog/product-crud-dialog.component';
import {ProductService} from './product.service';
import {SharedModule} from '@shared/shared.module';


@NgModule({
  declarations: [ProductListComponent, ProductCrudDialogComponent],
  providers: [ProductService],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [ProductListComponent]
})
export class ProductModule {
}
