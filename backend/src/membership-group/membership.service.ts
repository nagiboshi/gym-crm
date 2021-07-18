import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {MembershipGroup} from './membership-group';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Membership} from './membership';

@Injectable()
export class MembershipService extends TypeOrmCrudService<Membership>{

  constructor( @InjectRepository(Membership) public repo: Repository<Membership> ) {
    super(repo);
  }


}
