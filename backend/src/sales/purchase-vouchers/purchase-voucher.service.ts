import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {PurchaseVoucher} from './purchase-voucher';
import {PurchaseVoucherSubmit} from './purchase-voucher.submit';
import {Product} from '../product/product';
import {Repository} from 'typeorm';
import {PurchaseVoucherItem} from './purchase-voucher-item';

@Injectable()
export class PurchaseVoucherService extends TypeOrmCrudService<PurchaseVoucher> {
  constructor(@InjectRepository(PurchaseVoucher) public repo: Repository<PurchaseVoucher>) {
    super(repo);
  }

  valueOf(purchaseVoucherSubmitItem: PurchaseVoucherSubmit): PurchaseVoucher {
    const purchaseVoucher: PurchaseVoucher = new PurchaseVoucher();
    purchaseVoucher.id = purchaseVoucherSubmitItem.id;
    purchaseVoucher.from = purchaseVoucherSubmitItem.from;
    purchaseVoucher.to = purchaseVoucherSubmitItem.to;
    purchaseVoucher.supplier = purchaseVoucherSubmitItem.supplier;
    purchaseVoucher.items = purchaseVoucherSubmitItem.items as any as Array<PurchaseVoucherItem>;
    return purchaseVoucher;
  }
}
