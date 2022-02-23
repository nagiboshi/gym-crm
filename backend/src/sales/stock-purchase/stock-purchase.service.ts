import {Inject, Injectable, Request} from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {StockPurchase} from './stock-purchase';
import {CrudRequest, ParsedRequest} from '@nestjsx/crud';
import {DeepPartial, Repository} from 'typeorm';
import {InventoryService} from '../inventory/inventory.service';

@Injectable()
export class StockPurchaseService extends TypeOrmCrudService<StockPurchase>{

  constructor(@InjectRepository(StockPurchase) repo: Repository<StockPurchase>, private inventoryService: InventoryService) {
    super(repo);
  }

  async createOne(@ParsedRequest() parsedReq: CrudRequest, dto: DeepPartial<StockPurchase>): Promise<StockPurchase> {
    const purchase = await super.createOne(parsedReq, dto);
    // console.log(req.)
    // console.log(this.requestService.request.user);
    const item = await this.inventoryService.findOne(purchase.itemId);
    item.qty-=purchase.qty;
    await this.inventoryService.repo.save(item);
    return purchase;
  }
}
