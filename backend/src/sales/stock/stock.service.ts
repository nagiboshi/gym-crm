import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Stock} from './stock';

@Injectable()
export class StockService extends TypeOrmCrudService<Stock> {
  constructor(@InjectRepository(Stock) repo) {
    super(repo);
  }
}
