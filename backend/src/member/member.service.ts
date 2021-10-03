import { Injectable } from '@nestjs/common';
import {Member} from './member';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

@Injectable()
export class MemberService extends TypeOrmCrudService<Member>{

  constructor(@InjectRepository(Member) public repo: Repository<Member>) {
    super(repo);
  }
}
