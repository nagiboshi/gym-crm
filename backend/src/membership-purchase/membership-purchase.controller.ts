import {Controller, UseGuards} from '@nestjs/common';
import {Crud, CrudRequest, Override, ParsedBody, ParsedRequest} from '@nestjsx/crud';
import {MembershipPurchase} from './membership-purchase';
import {MembershipPurchaseService} from './membership-purchase.service';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {MemberService} from '../member/member.service';
import {cloneDeep} from 'lodash';

@Crud(
  {
    model: {
      type: MembershipPurchase
    },
    query: {
      join: {
        membership: {eager: false},
        members: {eager: false},
        'members.activeMembership': {eager: false},
        freeze: {eager: false}
      }
    }
  }
)
@Controller('membership-purchase')
@UseGuards(JwtAuthGuard)
export class MembershipPurchaseController {

  constructor(private service: MembershipPurchaseService, private memberService: MemberService) {
  }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: MembershipPurchase,
  ) {
    const membershipPurchase = await this.service.createOne(req, dto);
    for (let member of membershipPurchase.members) {
      member.activeMembership = cloneDeep(membershipPurchase);
    }
    await this.memberService.repo.save(membershipPurchase.members);
    return membershipPurchase;
  }

}
