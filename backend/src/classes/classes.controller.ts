import {Controller, Request, UseGuards} from '@nestjs/common';
import {Crud, CrudRequest, Override, ParsedBody, ParsedRequest} from '@nestjsx/crud';
import {ClassModel} from './class-model';
import {ClassesService} from './classes.service';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';

@Crud({
  model: {
    type: ClassModel
  },

})
@Controller('classes')
@UseGuards(JwtAuthGuard)
export class ClassesController {

  constructor(public service: ClassesService) {
  }

  @Override()
  createOne(
    @Request() request,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: ClassModel
  ) {
    dto.branchId = request.user.selectedBranch.id;
    return this.service.createOne(req, dto);
  }


  @Override()
  getMany(
    @Request() request: Request & { user: any },
    @ParsedRequest() req: CrudRequest,
  ) {
    const userBranchId = request.user.selectedBranch.id;
    req.parsed.search.$and.push({branchId: {$eq: userBranchId}});
    return this.service.getMany(req);
  }
}
