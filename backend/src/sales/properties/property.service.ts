import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Property} from './property';
import {Repository} from 'typeorm';

@Injectable()
export class PropertyService extends TypeOrmCrudService<Property> {
  constructor(@InjectRepository(Property) public repo: Repository<Property>) {
    super(repo);
  }
}
