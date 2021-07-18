import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {MembershipPurchase} from './membership-purchase';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class MembershipPurchaseService extends TypeOrmCrudService<MembershipPurchase>{

  constructor(@InjectRepository(MembershipPurchase) repo) {
    super(repo);
  }
}
