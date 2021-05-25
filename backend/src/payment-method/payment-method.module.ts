import { Module } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodController } from './payment-method.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PaymentMethod} from './payment-method';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod])],
  providers: [PaymentMethodService],
  controllers: [PaymentMethodController]
})
export class PaymentMethodModule {}
