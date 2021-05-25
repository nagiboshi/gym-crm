import { Module } from '@nestjs/common';
import { PurchaseItemService } from './purchase-item.service';
import { PurchaseItemController } from './purchase-item.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PurchaseItem} from './purchase-item';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseItem])],
  providers: [PurchaseItemService],
  controllers: [PurchaseItemController]
})
export class PurchaseItemModule {}
