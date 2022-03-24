import {Module} from '@nestjs/common';
import {MemberController} from './member.controller';
import {MemberService} from './member.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Member} from './member';
import {SocialNetworkAccountModule} from '../social-network-account/social-network-account.module';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), SocialNetworkAccountModule],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService]
})
export class MemberModule {
}
