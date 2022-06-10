import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReportsComponent} from './reports/reports.component';
import {ReportsRoutingModule} from './reports-routing.module';
import {SharedModule} from '@shared/shared.module';
import {AttendanceReportComponent} from './attendance-report/attendance-report.component';
import {ClassesModule} from '../classes/classes.module';
import {MembersReportComponent} from './members-report/members-report.component';
import {SalesReportComponent} from './sales-report/sales-report.component';


@NgModule({
  declarations: [
    ReportsComponent,
    AttendanceReportComponent,
    MembersReportComponent,
    SalesReportComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    ClassesModule
  ],
  exports: [AttendanceReportComponent, MembersReportComponent, SalesReportComponent]
})
export class ReportsModule {
}
