import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {PurchaseVoucher} from './purchase-voucher';
import {PurchaseVoucherSubmit} from './purchase-voucher.submit';
import {Product} from '../product/product';
import {Repository} from 'typeorm';
import {PurchaseVoucherItem} from './purchase-voucher-item';

@Injectable()
export class PurchaseVoucherItemService extends TypeOrmCrudService<PurchaseVoucherItem> {
  constructor(@InjectRepository(PurchaseVoucherItem) public repo: Repository<PurchaseVoucherItem>) {
    super(repo);
  }
}
