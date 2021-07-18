import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {PaymentMethod} from '../../payment-method/payment-method';
import {InjectRepository} from '@nestjs/typeorm';
import {ProductField} from './product-field';

@Injectable()
export class ProductFieldsService extends TypeOrmCrudService<ProductField> {
  constructor(@InjectRepository(ProductField) repo) {
    super(repo);
  }
}
