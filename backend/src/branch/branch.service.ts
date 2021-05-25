import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {Branch} from './branch';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class BranchService extends TypeOrmCrudService<Branch> {
  constructor(@InjectRepository(Branch) repo) {
    super(repo);
  }
}
