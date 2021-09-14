import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {GoogleChartsModule} from 'angular-google-charts';
import {ScriptLoaderService} from 'angular-google-charts';
import {MembersModule} from '../members/members.module';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    GoogleChartsModule.forRoot(),
    MembersModule
  ],
  providers: [ScriptLoaderService],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule {
}
