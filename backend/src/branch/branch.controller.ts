import {Controller, UseGuards} from '@nestjs/common';
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
@UseGuards(JwtAuthGuard)
export class BranchController {

  constructor(public service: BranchService) {
  }
}
