import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Tax} from './tax';
import {Repository} from 'typeorm';

@Injectable()
export class TaxService extends TypeOrmCrudService<Tax> {
  constructor(@InjectRepository(Tax) repo: Repository<Tax>) {
    super(repo);
  }
}
