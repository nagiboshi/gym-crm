import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {PurchaseItem} from './purchase-item';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class PurchaseItemService extends TypeOrmCrudService<PurchaseItem>{

  constructor(@InjectRepository(PurchaseItem) repo) {
    super(repo);
  }
}
