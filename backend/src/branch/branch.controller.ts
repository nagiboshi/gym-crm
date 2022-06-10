import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {Branch} from './branch';
import {BranchService} from './branch.service';

@Crud({
  model: {
    type: Branch
  }
})
@Controller('branch')
// FIXME :: Check guards for particular method
// @UseGuards(JwtAuthGuard)
export class BranchController {

  constructor(public service: BranchService) {
  }

}
