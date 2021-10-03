import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {StockPurchase} from './stock-purchase';

@Injectable()
export class StockPurchaseService extends TypeOrmCrudService<StockPurchase>{

  constructor(@InjectRepository(StockPurchase) repo) {
    super(repo);
  }
}
