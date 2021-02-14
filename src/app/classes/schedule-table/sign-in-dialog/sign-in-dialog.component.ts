import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CommunicationService, DaySchedule} from '../../../shared/communication.service';
import {Member} from '../../../models/member.model';
import {ScheduleMember} from '../../../models/schedule-member.model';
import {Moment} from 'moment';
import {remove} from 'lodash';
export interface SignInDialogData {
  daySchedule: DaySchedule;
  signInDate: Moment;
}

@Component({
  selector: 'app-sign-in-dialog',
  templateUrl: './sign-in-dialog.component.html',
  styleUrls: ['./sign-in-dialog.component.scss']
})
export class SignInDialogComponent implements OnInit {
  scheduleMembers: ScheduleMember[];

  constructor(@Inject(MAT_DIALOG_DATA) public signInDialogData: SignInDialogData, communicationService: CommunicationService) {
  }

  ngOnInit(): void {
    this.scheduleMembers = [...this.signInDialogData.daySchedule.signedMembers$.getValue()];
  }

  removeFromSchedule(signedMember: ScheduleMember) {
    remove(this.scheduleMembers, scheduleMember => scheduleMember.member.firstName == signedMember.member.firstName
                                  && scheduleMember.member.lastName == signedMember.member.lastName );
  }

  memberToScheduleMember(schedule: DaySchedule, member: Member, signInDate: Moment): ScheduleMember {
    return { scheduleDate: signInDate.toDate().getTime(),  member, id: 0};
  }


  addMemberToSchedule(member: Member) {
    this.scheduleMembers.push(this.memberToScheduleMember(this.signInDialogData.daySchedule, member, this.signInDialogData.signInDate));
  }
}
