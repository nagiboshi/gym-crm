import {Injectable} from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {ProductField} from '../product-fields/product-field';
import {InjectRepository} from '@nestjs/typeorm';
import {ProductTag} from './product-tag';
import {Repository} from 'typeorm';

@Injectable()
export class TagService extends TypeOrmCrudService<ProductTag> {
  constructor( @InjectRepository(ProductTag) public repo: Repository<ProductTag>) {
    super(repo);
  }
}
