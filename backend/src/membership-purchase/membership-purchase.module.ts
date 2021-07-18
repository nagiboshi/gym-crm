import { Module } from '@nestjs/common';
import { MembershipPurchaseService } from './membership-purchase.service';
import { MembershipPurchaseController } from './membership-purchase.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MembershipPurchase} from './membership-purchase';

@Module({
  imports: [TypeOrmModule.forFeature([MembershipPurchase])],
  providers: [MembershipPurchaseService],
  controllers: [MembershipPurchaseController]
})
export class MembershipPurchaseModule {}
