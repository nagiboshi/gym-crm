import {Inject, Injectable, Request} from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {StockPurchase} from './stock-purchase';
import {CrudRequest, ParsedRequest} from '@nestjsx/crud';
import {DeepPartial, Repository} from 'typeorm';
import {InventoryService} from '../inventory/inventory.service';
import {PaymentService} from '../../payments/payment.service';

@Injectable()
export class StockPurchaseService extends TypeOrmCrudService<StockPurchase>{

  constructor(@InjectRepository(StockPurchase) repo: Repository<StockPurchase>, private paymentService: PaymentService, private inventoryService: InventoryService) {
    super(repo);
  }

  async createOne(@ParsedRequest() parsedReq: CrudRequest, dto: DeepPartial<StockPurchase>): Promise<StockPurchase> {
    const payments = dto.payments;
    dto.payments = null;

    const purchase = await super.createOne(parsedReq, dto);
    payments.forEach( p => p.stockPurchaseId = purchase.id);
    const savedPayments = await this.paymentService.repo.save(payments);
    purchase.payments = savedPayments;
    const item = await this.inventoryService.findOne(purchase.itemId);
    if( item.qty == 0 || item.qty < purchase.qty ) {
      this.throwBadRequestException(`There is not enough items in the store`);
    }
    item.qty-=purchase.qty;
    await this.inventoryService.repo.save(item);
    return purchase;
  }
}
