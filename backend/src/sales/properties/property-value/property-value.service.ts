import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {PropertyValue} from './property-value';
import {Repository} from 'typeorm';

@Injectable()
export class PropertyValueService extends TypeOrmCrudService<PropertyValue> {
  constructor(@InjectRepository(PropertyValue) public repo: Repository<PropertyValue>) {
    super(repo);
  }
}
