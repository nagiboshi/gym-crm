import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MembersRoutingModule} from './members-routing.module';
import {MembersComponent} from './members.component';
import {MemberProfileComponent} from './member-profile/member-profile.component';
import {SharedModule} from '@shared/shared.module';
import {MembersService} from './members.service';
import { MembershipStatusComponent } from './member-profile/membership-status/membership-status.component';


@NgModule({
  declarations: [MembersComponent, MemberProfileComponent, MembershipStatusComponent],
  exports: [
    MembersComponent
  ],
  imports: [
    CommonModule,
    MembersRoutingModule,
    SharedModule,
  ]
})
export class MembersModule {
}
