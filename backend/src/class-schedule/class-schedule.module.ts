import { Module } from '@nestjs/common';
import { ClassScheduleService } from './class-schedule.service';
import { ClassScheduleController } from './class-schedule.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ClassSchedule} from './class-schedule.model';
import { ScheduleMemberModule } from '../schedule-member/schedule-member.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClassSchedule]), ScheduleMemberModule],
  providers: [ClassScheduleService],
  controllers: [ClassScheduleController]
})
export class ClassScheduleModule {}
