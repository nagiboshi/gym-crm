import {Controller, UseGuards} from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {SocialNetworkAccount} from './social-network-account';
import {SocialNetworkAccountService} from './social-network-account.service';


@Crud({
  model: {
    type: SocialNetworkAccount
  }
})
@Controller('social-network-account')
@UseGuards(JwtAuthGuard)
export class SocialNetworkAccountController {

  constructor( public service: SocialNetworkAccountService) {
  }
}
