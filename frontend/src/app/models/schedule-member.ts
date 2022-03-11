import {Member} from '@models/member';

export interface ScheduleMember {
  id: number;
  scheduleDate: Date;
  memberId: number;
  member?: Member;
}
