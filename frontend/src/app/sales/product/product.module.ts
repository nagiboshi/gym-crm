import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductService} from './product.service';
import {SharedModule} from '@shared/shared.module';
import {StockPurchaseFormComponent} from './product-purchase-form/stock-purchase-form.component';
import { ViewItemComponent } from './view-product/view-item.component';


@NgModule({
  declarations: [ StockPurchaseFormComponent, ViewItemComponent],
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
