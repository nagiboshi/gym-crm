import {Module} from '@nestjs/common';
import {ReportsController} from './reports.controller';
import {SalesModule} from '../sales/sales.module';
import {ScheduleMemberModule} from '../schedule-member/schedule-member.module';
import {MemberModule} from '../member/member.module';
import {PaymentsModule} from '../payments/payments.module';
import {SharedModule} from '../shared/shared.module';
import {TaxModule} from '../tax/tax.module';

@Module({
  controllers: [ReportsController],
  imports: [SalesModule, PaymentsModule, ScheduleMemberModule, MemberModule, SharedModule, TaxModule],
  providers: []
})
export class ReportsModule {
}
