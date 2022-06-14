import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WorkflowComponent} from './workflow-container/workflow.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '@shared/shared.module';
import { WorkflowElementComponent } from './control-element/workflow-element.component';
import { FormListComponent } from './form-list/form-list.component';
import { FormOutletComponent } from '../forms/form-outlet/form-outlet.component';


@NgModule({
  declarations: [
    WorkflowComponent,
    WorkflowElementComponent,
    FormListComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild([
      {path: '', component: WorkflowComponent},
      {path: '/form-list', component: FormListComponent}
    ])
  ]
})
export class WorkflowModule {
}
