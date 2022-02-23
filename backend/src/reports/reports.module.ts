import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { SalesModule} from '../sales/sales.module';

@Module({
  controllers: [ReportsController],
  imports: [SalesModule],
  providers: []
})
export class ReportsModule {}
