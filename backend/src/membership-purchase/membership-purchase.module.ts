import { Module } from '@nestjs/common';
import { MembershipPurchaseService } from './membership-purchase.service';
import { MembershipPurchaseController } from './membership-purchase.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MembershipPurchase} from './membership-purchase';
import {MemberModule} from '../member/member.module';
import {PaymentsModule} from '../payments/payments.module';
import {PaymentMethodModule} from '../payment-method/payment-method.module';

@Module({
  imports: [PaymentsModule, PaymentMethodModule, TypeOrmModule.forFeature([MembershipPurchase]), MemberModule],
  providers: [MembershipPurchaseService],
  controllers: [MembershipPurchaseController]
})
export class MembershipPurchaseModule {}
