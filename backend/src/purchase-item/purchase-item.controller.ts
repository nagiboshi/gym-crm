import {Controller} from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {PurchaseItem} from './purchase-item';
import {ScheduleMemberService} from '../schedule-member/schedule-member.service';
import {PurchaseItemService} from './purchase-item.service';


@Crud(
  {
    model: {
      type: PurchaseItem
    },
    query: {
      join: {
        product: {eager: false},
        members: {eager: false},
        freeze: {eager: false}
      }
    }
  }
)
@Controller('purchase-item')
export class PurchaseItemController {

  constructor(private service: PurchaseItemService) {
  }
}
