import {Module} from '@nestjs/common';
import {ReportsController} from './reports.controller';
import {SalesModule} from '../sales/sales.module';
import {ScheduleMemberModule} from '../schedule-member/schedule-member.module';
import {MemberModule} from '../member/member.module';

@Module({
  controllers: [ReportsController],
  imports: [SalesModule, ScheduleMemberModule, MemberModule],
  providers: []
})
export class ReportsModule {
}
