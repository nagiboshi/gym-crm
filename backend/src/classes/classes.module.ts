import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ClassModel} from './class-model';

@Module({
  imports: [TypeOrmModule.forFeature([ClassModel])],
  providers: [ClassesService],
  controllers: [ClassesController]
})
export class ClassesModule {}
