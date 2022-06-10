import {Controller, Req, UseGuards} from '@nestjs/common';
import {Crud, CrudRequest, Override, ParsedBody, ParsedRequest} from '@nestjsx/crud';
import {MembershipPurchase} from './membership-purchase';
import {MembershipPurchaseService} from './membership-purchase.service';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {MemberService} from '../member/member.service';
import {cloneDeep} from 'lodash';
import {PaymentService} from '../payments/payment.service';
import {JWTPayload} from '../auth/jwt.strategy';

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
        freeze: {eager: false},
        payments: {eager: false},
        buyer: {eager: false},
        saleLocation: {eager: false},
      }
    }
  }
)
@Controller('membership-purchase')
@UseGuards(JwtAuthGuard)
export class MembershipPurchaseController {

  constructor(private service: MembershipPurchaseService, private paymentService: PaymentService, private memberService: MemberService) {
  }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: MembershipPurchase,
    @Req() request: Request & {user: JWTPayload}
  ) {


    let payments = dto.payments;
    dto.payments = [];
    dto.saleLocationId = request.user.selectedBranch.id;
    const membershipPurchase = await this.service.createOne(req, dto);

    payments.forEach( p =>  { p.membershipPurchaseId = membershipPurchase.id;});
    payments = await this.paymentService.repo.save(payments);
    membershipPurchase.payments = payments;

    for (let member of membershipPurchase.members) {
      member.activeMembership = cloneDeep(membershipPurchase);
    }
    await this.memberService.repo.save(membershipPurchase.members);
    return membershipPurchase;
  }

}
