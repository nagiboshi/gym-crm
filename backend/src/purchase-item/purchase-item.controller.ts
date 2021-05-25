import {Controller} from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {PurchaseItem} from './purchase-item';


@Crud(
  {
    model: {
      type: PurchaseItem
    }
  }
)
@Controller('purchase-item')
export class PurchaseItemController {
}
