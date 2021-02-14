import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ScheduleTableComponent} from './schedule-table/schedule-table.component';

const routes: Routes = [{path: 'schedules', component: ScheduleTableComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassesRoutingModule {
}
