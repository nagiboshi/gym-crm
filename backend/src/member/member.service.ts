import { Injectable } from '@nestjs/common';
import {Member} from './member';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class MemberService extends TypeOrmCrudService<Member>{

  constructor(@InjectRepository(Member) repo) {
    super(repo);
  }
}
