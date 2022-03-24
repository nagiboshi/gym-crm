import {Injectable} from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {SocialNetworkAccount} from './social-network-account';
import {Repository} from 'typeorm';

@Injectable()
export class SocialNetworkAccountService extends TypeOrmCrudService<SocialNetworkAccount> {
  constructor(@InjectRepository(SocialNetworkAccount)public repo: Repository<SocialNetworkAccount> ) {
    super(repo);
  }
}
