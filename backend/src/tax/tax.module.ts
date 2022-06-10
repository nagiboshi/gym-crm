import {Module} from '@nestjs/common';
import {TaxService} from './tax.service';
import {TaxController} from './tax.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Tax} from './tax';

@Module({
  imports: [TypeOrmModule.forFeature([Tax])],
  providers: [TaxService],
  controllers: [TaxController],
  exports: [TaxService]
})
export class TaxModule {
}
