import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { SalesModule} from '../sales/sales.module';
import {ClassScheduleModule} from '../class-schedule/class-schedule.module';
import {ScheduleMemberService} from '../schedule-member/schedule-member.service';
import {ScheduleMemberModule} from '../schedule-member/schedule-member.module';

@Module({
  controllers: [ReportsController],
  imports: [SalesModule, ScheduleMemberModule],
  providers: []
})
export class ReportsModule {}
