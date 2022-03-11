import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports/reports.component';
import {ReportsRoutingModule} from './reports-routing.module';
import { StockValuationReportComponent } from './stock-valuation-report/stock-valuation-report.component';
import {SharedModule} from '@shared/shared.module';
import { AttendanceReportComponent } from './attendance-report/attendance-report.component';
import {ClassesModule} from '../classes/classes.module';



@NgModule({
  declarations: [
    ReportsComponent,
    StockValuationReportComponent,
    AttendanceReportComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    ClassesModule
  ],
  exports: [StockValuationReportComponent, AttendanceReportComponent]
})
export class ReportsModule { }
