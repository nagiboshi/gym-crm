import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsPageComponent} from './settings-page/settings-page.component';
import {CreateClassDialogComponent} from './settings-page/classes/create-class-dialog/create-class-dialog.component';
import {SharedModule} from '@shared/shared.module';
import {SettingsRoutingModule} from './settings-routing.module';
import {ClassSettingsComponent} from './settings-page/classes/class-settings/class-settings.component';
import {PaymentMethodsSettingsComponent} from './settings-page/payment-methods-settings/payment-methods-settings.component';
import {PaymentMethodCreateDialogComponent} from './settings-page/payment-methods-settings/payment-method-create-dialog/payment-method-create-dialog.component';
import { PlansSettingsComponent } from './settings-page/plans-settings/plans-settings.component';
import { SalesSettingsComponent } from './settings-page/sales-settings/sales-settings.component';
import { SalesDialogComponent } from './settings-page/sales-settings/sales-dialog/sales-dialog.component';


@NgModule({
  declarations: [SettingsPageComponent, CreateClassDialogComponent, PaymentMethodCreateDialogComponent, ClassSettingsComponent, PaymentMethodsSettingsComponent, PlansSettingsComponent, SalesSettingsComponent, SalesDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule {
}
