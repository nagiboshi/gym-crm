import {Global, Injectable} from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectConnection, InjectRepository} from '@nestjs/typeorm';
import {User} from './user';
@Injectable()
export class UserService extends TypeOrmCrudService<User> {

  constructor(@InjectRepository(User) repo) {
    super(repo);

  }
}
