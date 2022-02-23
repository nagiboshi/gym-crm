import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {ScheduleMember} from '../../schedule-member/schedule-member';
import {InjectRepository} from '@nestjs/typeorm';
import {Supplier} from './supplier';

@Injectable()
export class SupplierService extends TypeOrmCrudService<Supplier> {
  constructor(@InjectRepository(Supplier) public repo) {
    super(repo);
  }

}
