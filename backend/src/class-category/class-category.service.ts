import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {ClassCategory} from './class-category';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class ClassCategoryService extends TypeOrmCrudService<ClassCategory>{
  constructor(@InjectRepository(ClassCategory) repo) {
    super(repo);
  }
}
