import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ClassesRoutingModule} from './classes-routing.module';
import {ScheduleTableComponent} from './schedule-table/schedule-table.component';
import {SharedModule} from '../shared/shared.module';
import { AddScheduleDialogComponent } from './schedule-table/add-schedule-dialog/add-schedule-dialog.component';
import {FormsModule} from '@angular/forms';
import { SignInDialogComponent } from './schedule-table/sign-in-dialog/sign-in-dialog.component';
import {NgxDaterangepickerMd} from 'ngx-daterangepicker-material';
import {ScheduleCalendarHeaderComponent} from './schedule-table/schedule-calendar/schedule.calendar-header.component';
import {SelectionStrategyEventEmitter} from './schedule-table/schedule-calendar/selection-strategy.event-emitter';
@NgModule({
    declarations: [ScheduleTableComponent, ScheduleCalendarHeaderComponent, AddScheduleDialogComponent, SignInDialogComponent],
    providers: [SelectionStrategyEventEmitter],
    imports: [
        CommonModule,
        SharedModule,
        NgxDaterangepickerMd.forRoot(),
        ClassesRoutingModule,
        FormsModule
    ]
})
export class ClassesModule {
}
