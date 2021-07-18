import { Module } from '@nestjs/common';
import { MembershipGroupService } from './membership-group.service';
import { MembershipGroupController } from './membership-group.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MembershipGroup} from './membership-group';
import {MembershipService} from './membership.service';
import {Membership} from './membership';

@Module({
  imports: [TypeOrmModule.forFeature([MembershipGroup, Membership])],
  providers: [MembershipGroupService, MembershipService],
  controllers: [MembershipGroupController]
})
export class MembershipGroupModule {}
