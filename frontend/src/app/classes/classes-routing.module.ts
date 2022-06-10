import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ScheduleTableComponent} from './schedule-table/schedule-table.component';
import {ClassListComponent} from './class-list/class-list.component';
import {CategoryListComponent} from '@shared/category/category-list.component';

const routes: Routes = [
  {path: '', component: ScheduleTableComponent},
  {path: 'schedules', component: ScheduleTableComponent},
  {path: 'list', component: ClassListComponent},
  {path: 'class-categories', component: CategoryListComponent, data: {type: 'service'}}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassesRoutingModule {
}
