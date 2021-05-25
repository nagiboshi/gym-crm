import { Module } from '@nestjs/common';
import { ClassCategoryService } from './class-category.service';
import { ClassCategoryController } from './class-category.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ClassCategory} from './class-category';

@Module({
  imports: [TypeOrmModule.forFeature([ClassCategory])],
  providers: [ClassCategoryService],
  controllers: [ClassCategoryController]
})
export class ClassCategoryModule {}
