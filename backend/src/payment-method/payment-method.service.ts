import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {PaymentMethod} from './payment-method';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class PaymentMethodService extends TypeOrmCrudService<PaymentMethod> {
  constructor(@InjectRepository(PaymentMethod) repo) {
    super(repo);
  }
}
