import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {ClassModel} from './class-model';

@Injectable()
export class ClassesService extends TypeOrmCrudService<ClassModel>{

  constructor(@InjectRepository(ClassModel) repo) {
    super(repo);
  }
}
