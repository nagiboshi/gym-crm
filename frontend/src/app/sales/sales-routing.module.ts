import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SalesSettingsComponent} from './sales-settings/sales-settings.component';

const routes: Routes = [
  {path: '', component: SalesSettingsComponent }
];
  // {path: '', component: P}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule {
}
