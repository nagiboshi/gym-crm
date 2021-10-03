import {Controller} from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {MembershipPurchase} from './membership-purchase';
import {MembershipPurchaseService} from './membership-purchase.service';


@Crud(
  {
    model: {
      type: MembershipPurchase
    },
    query: {
      join: {
        membership: {eager: false},
        members: {eager: false},
        freeze: {eager: false}
      }
    }
  }
)
@Controller('membership-purchase')
export class MembershipPurchaseController {

  constructor(private service: MembershipPurchaseService) {
  }
}
