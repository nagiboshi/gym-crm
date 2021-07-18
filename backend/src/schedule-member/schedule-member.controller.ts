import {Controller, UseGuards} from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {ScheduleMember} from './schedule-member';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {ScheduleMemberService} from './schedule-member.service';

@Crud({
  model: {
    type: ScheduleMember
  },
  query: {
    join: {
      member: {eager: false},
      "member.membershipPurchases": {eager: false, alias: 'memberPurchaseItems'},
      "member.membershipPurchases.membership": {eager: false, alias: 'membershipPurchase'}
    }
  }
})
@UseGuards(JwtAuthGuard)
@Controller('schedule-member')
export class ScheduleMemberController {


  constructor(private service: ScheduleMemberService) {
  }

}
