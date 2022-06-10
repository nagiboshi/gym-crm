import { Pipe, PipeTransform } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ScheduleMember} from '@models/schedule-member';
import * as _moment from 'moment';

const moment =  _moment;
@Pipe({
  name: 'signedMembersSize'
})
export class SignedMembersSizePipe implements PipeTransform {
  constructor() {
  }
  transform(scheduleMembers: ScheduleMember[], ...args: any[]): unknown {
    const [scheduleWeekDay] = args;
    return scheduleMembers.filter( sMember => {
      const scheduleMoment = moment(sMember.scheduleDate);
      return scheduleMoment.startOf('day').isSame(scheduleWeekDay.date);
    }).length;
  }

}
