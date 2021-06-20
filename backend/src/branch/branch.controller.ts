import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {Branch} from './branch';
import {BranchService} from './branch.service';
import { Request } from 'express';

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

  // @Get('/userBranches')
  // public fetchUserBranches(@Req() request: Request ) {
  //   console.log(request.user);
  //   return 'user branches ';
  // }


}
