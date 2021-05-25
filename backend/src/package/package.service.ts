import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {Package} from './package';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class PackageService extends TypeOrmCrudService<Package>{

  constructor(@InjectRepository(Package) repo) {
    super(repo);
  }
}
