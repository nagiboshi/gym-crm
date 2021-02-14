import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MembersRoutingModule} from './members-routing.module';
import {MembersComponent} from './members.component';
import {AddMemberDialogComponent} from './add-member-dialog/add-member-dialog.component';
import {MemberProfileComponent} from './member-profile/member-profile.component';
import {SharedModule} from '../shared/shared.module';
import {FamilyMembersComponent} from './member-profile/family-member/family-members.component';


@NgModule({
  declarations: [MembersComponent, AddMemberDialogComponent, MemberProfileComponent, FamilyMembersComponent],
  exports: [
    MembersComponent
  ],
  providers: [],
  imports: [
    CommonModule,
    MembersRoutingModule,
    SharedModule
  ]
})
export class MembersModule {
}