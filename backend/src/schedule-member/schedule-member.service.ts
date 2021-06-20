import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {ScheduleMember} from './schedule-member';

@Injectable()
export class ScheduleMemberService extends TypeOrmCrudService<ScheduleMember> {
  constructor(@InjectRepository(ScheduleMember) repo) {
    super(repo);
  }
}
