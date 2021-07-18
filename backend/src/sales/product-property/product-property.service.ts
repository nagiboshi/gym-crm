import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {ProductFieldOption} from './product-field-option';

@Injectable()
export class ProductPropertyService extends TypeOrmCrudService<ProductFieldOption> {
  constructor(@InjectRepository(ProductFieldOption) repo) {
    super(repo);
  }
}
