import {Member} from '@models/member';

export interface ScheduleMember {
  id: number;
  memberId: number;
  member?: Member;
}
