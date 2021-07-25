import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {ProductFieldOption} from './product-field-option';
import {Repository} from 'typeorm';

@Injectable()
export class ProductFieldOptionService extends TypeOrmCrudService<ProductFieldOption> {
  constructor(@InjectRepository(ProductFieldOption) public repo: Repository<ProductFieldOption>) {
    super(repo);
  }
}
