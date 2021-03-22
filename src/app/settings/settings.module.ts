import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsPageComponent} from './settings-page/settings-page.component';
import {CreateClassDialogComponent} from './settings-page/classes/create-class-dialog/create-class-dialog.component';
import {SharedModule} from '../shared/shared.module';
import {SettingsRoutingModule} from './settings-routing.module';
import {ClassSettingsComponent} from './settings-page/classes/class-settings/class-settings.component';
import {PaymentMethodsSettingsComponent} from './settings-page/payment-methods-settings/payment-methods-settings.component';


@NgModule({
  declarations: [SettingsPageComponent, CreateClassDialogComponent, ClassSettingsComponent, PaymentMethodsSettingsComponent],
  imports: [
    CommonModule,
    SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule {
}
