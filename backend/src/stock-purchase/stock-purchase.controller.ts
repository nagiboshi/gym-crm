import { Controller } from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {StockPurchaseService} from './stock-purchase.service';
import {StockPurchase} from './stock-purchase';

@Crud(
  {
    model: {
      type: StockPurchase
    },
    query: {
      join: {
        properties: {eager: false},
        stock: {eager: false}
      },
      alwaysPaginate: true,
    }
  }
)
@Controller('stock-purchase')
export class StockPurchaseController {

  constructor(private service: StockPurchaseService) {
  }

}
