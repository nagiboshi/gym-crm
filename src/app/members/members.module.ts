import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MembersRoutingModule} from './members-routing.module';
import {MembersComponent} from './members.component';
import {MemberProfileComponent} from './member-profile/member-profile.component';
import {SharedModule} from '../shared/shared.module';
import {FamilyMembersComponent} from './member-profile/family-member/family-members.component';
import {MatTooltipModule} from '@angular/material/tooltip';


@NgModule({
  declarations: [MembersComponent, MemberProfileComponent, FamilyMembersComponent],
  exports: [
    MembersComponent
  ],
  providers: [],
  imports: [
    CommonModule,
    MembersRoutingModule,
    SharedModule,
  ]
})
export class MembersModule {
}
