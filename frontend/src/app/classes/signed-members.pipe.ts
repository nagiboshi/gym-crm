import { Pipe, PipeTransform } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ScheduleMember} from '@models/schedule-member';
import * as _moment from 'moment';
import {ScheduleWeekDay} from '@shared/communication.service';

const moment = _moment;

@Pipe({
  name: 'signedMembersPipe'
})
export class SignedMembersPipe implements PipeTransform {

  transform(scheduleMembers$: BehaviorSubject<ScheduleMember[]>, ...args: any[]): ScheduleMember[] {
    const [scheduleWeekDay] = args;
    const scheduleMembers = scheduleMembers$.getValue();
    return scheduleMembers.filter( sMember => {
      const scheduleMoment = moment(sMember.scheduleDate);
      return scheduleMoment.startOf('day').isSame(scheduleWeekDay.date);
    })
  }

}
