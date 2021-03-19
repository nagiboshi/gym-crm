import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { CreateClassDialogComponent } from './create-class-dialog/create-class-dialog.component';
import {SharedModule} from '../shared/shared.module';
import { ClassSettingsPageComponent } from './class-settings-page/class-settings-page.component';
import { PaymentSettingsComponent } from './payment-settings/payment-settings.component';
import {SettingsRoutingModule} from './settings-routing.module';



@NgModule({
  declarations: [SettingsPageComponent, CreateClassDialogComponent, ClassSettingsPageComponent, PaymentSettingsComponent],
  imports: [
    CommonModule,
    SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
