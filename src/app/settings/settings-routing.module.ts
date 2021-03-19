import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SettingsPageComponent} from './settings-page/settings-page.component';
import {ClassSettingsPageComponent} from './class-settings-page/class-settings-page.component';
import {PaymentSettingsComponent} from './payment-settings/payment-settings.component';

const routes: Routes = [
  {path: '', component: SettingsPageComponent},
  {path: 'class-settings', component: ClassSettingsPageComponent},
  {path: 'payment-settings', component: PaymentSettingsComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {
}
