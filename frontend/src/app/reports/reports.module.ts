import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports/reports.component';
import {ReportsRoutingModule} from './reports-routing.module';
import { StockValuationReportComponent } from './stock-valuation-report/stock-valuation-report.component';
import {SharedModule} from '@shared/shared.module';



@NgModule({
  declarations: [
    ReportsComponent,
    StockValuationReportComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule
  ],
  exports: [StockValuationReportComponent]
})
export class ReportsModule { }
