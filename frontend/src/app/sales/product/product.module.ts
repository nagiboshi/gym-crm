import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductService} from './product.service';
import {SharedModule} from '@shared/shared.module';
import {StockPurchaseFormComponent} from './product-purchase-form/stock-purchase-form.component';
import { ViewProductComponent } from './view-product/view-product.component';


@NgModule({
  declarations: [ StockPurchaseFormComponent, ViewProductComponent],
  providers: [ProductService],
  imports: [
    CommonModule,
    SharedModule
  ],
    exports: [
        StockPurchaseFormComponent
    ]
})
export class ProductModule {
}
