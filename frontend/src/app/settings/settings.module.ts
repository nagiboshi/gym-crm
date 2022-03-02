import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsPageComponent} from './settings-page/settings-page.component';
import {SharedModule} from '@shared/shared.module';
import {SettingsRoutingModule} from './settings-routing.module';
import {PaymentMethodsSettingsComponent} from './settings-page/payment-methods-settings/payment-methods-settings.component';
import {PaymentMethodCreateDialogComponent} from './settings-page/payment-methods-settings/payment-method-create-dialog/payment-method-create-dialog.component';
import {UsersComponent} from './settings-page/users/users.component';
import {UserMergeDialogComponent} from './settings-page/users/user-merge-dialog/user-merge-dialog.component';
import { UserRolePipe } from './settings-page/users/user-role.pipe';


@NgModule({
  declarations: [SettingsPageComponent,
    PaymentMethodCreateDialogComponent,
    PaymentMethodsSettingsComponent,
    UserMergeDialogComponent,
    UsersComponent,
    UserRolePipe],
  imports: [
    CommonModule,
    SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule {
}
