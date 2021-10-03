import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Subcategory} from './subcategory';

@Injectable()
export class SubcategoryService extends TypeOrmCrudService<Subcategory> {
  constructor(@InjectRepository(Subcategory) public repo) {
    super(repo);
  }
}
