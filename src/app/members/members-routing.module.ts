import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MembersComponent } from './members.component';
import {MemberProfileComponent} from './member-profile/member-profile.component';

const routes: Routes = [{ path: '', component: MembersComponent },
  {path: 'member/:id', component: MemberProfileComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembersRoutingModule { }
