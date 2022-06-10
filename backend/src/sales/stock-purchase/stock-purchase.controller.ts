import {Body, Request, Controller, UploadedFiles, UseGuards} from '@nestjs/common';
import {Crud, CrudAuth, CrudRequest, Override, ParsedBody, ParsedRequest} from '@nestjsx/crud';
import {StockPurchaseService} from './stock-purchase.service';
import {StockPurchase} from './stock-purchase';
import {User} from '../../user/user';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard';
import {UserService} from '../../user/user.service';

@Crud(
  {
    model: {
      type: StockPurchase
    },
    query: {
      join: {
        product: {eager: false}
      },
      alwaysPaginate: true,
    }
  }
)
@Controller('stock-purchase')
@UseGuards(JwtAuthGuard)
export class StockPurchaseController {

  constructor(private service: StockPurchaseService) {
  }

  @Override()
   createOne(
    @Request() request,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() body: StockPurchase) {

    body.sellerId = request.user.userId;
    body.saleLocationId = request.user.selectedBranch.id;
    return this.service.createOne(req, body);
  }


}
