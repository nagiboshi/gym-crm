import { Module } from '@nestjs/common';
import { StockPurchaseController } from './stock-purchase.controller';
import { StockPurchaseService } from './stock-purchase.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {StockPurchase} from './stock-purchase';

@Module({
  imports: [TypeOrmModule.forFeature([StockPurchase])],
  controllers: [StockPurchaseController],
  providers: [StockPurchaseService]
})
export class StockPurchaseModule {}
