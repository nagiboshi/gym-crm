import { Module } from '@nestjs/common';
import { ScheduleMemberService } from './schedule-member.service';
import { ScheduleMemberController } from './schedule-member.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ScheduleMember} from './schedule-member';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleMember])],
  providers: [ScheduleMemberService],
  controllers: [ScheduleMemberController]
})
export class ScheduleMemberModule {}
