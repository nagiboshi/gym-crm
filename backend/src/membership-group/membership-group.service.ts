import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {MembershipGroup} from './membership-group';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

@Injectable()
export class MembershipGroupService extends TypeOrmCrudService<MembershipGroup>{

  constructor( @InjectRepository(MembershipGroup) public repo: Repository<MembershipGroup> ) {
    super(repo);
  }


}
