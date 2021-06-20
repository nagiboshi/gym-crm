import { Module } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryController } from './product-category.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ProductCategory} from './product-category';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory])],
  providers: [ProductCategoryService],
  controllers: [ProductCategoryController]
})
export class ProductCategoryModule {}
