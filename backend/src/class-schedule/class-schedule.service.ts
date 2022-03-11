import {Injectable} from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {ClassSchedule} from './class-schedule.model';
import {Repository} from 'typeorm';

@Injectable()
export class ClassScheduleService extends TypeOrmCrudService<ClassSchedule> {

  constructor(@InjectRepository(ClassSchedule) public repo: Repository<ClassSchedule>) {
    super(repo);
  }
}
