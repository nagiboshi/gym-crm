import {Controller, Query, Request, UseGuards} from '@nestjs/common';
import {CreateManyDto, Crud, CrudRequest, Override, ParsedBody, ParsedRequest} from '@nestjsx/crud';
import {MembershipGroup} from './membership-group';
import {MembershipGroupService} from './membership-group.service';
import {MembershipService} from './membership.service';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';

@Crud({
  model: {
    type: MembershipGroup,
  },
  query: {
    join: {
      memberships: {
        eager: true
      },
    },
    sort: [
      {order: 'DESC', field: 'created'}
    ],

  },
})
@Controller('membershipGroup')
@UseGuards(JwtAuthGuard)
export class MembershipGroupController {

  constructor(public service: MembershipGroupService, public membershipService: MembershipService) {
  }

  @Override()
  getMany(
    @Request() request: Request & { user: any },
    @ParsedRequest() req: CrudRequest,
    @Query() query
  ) {
    const userBranchId = request.user.selectedBranch.id;

    if( query.type == 'local') {
      req.parsed.search.$and.push({branchId: {$eq: userBranchId} });
    }

    if( query.type == 'shared') {
      req.parsed.search.$or = [{type: {'$eq': 'shared'}},{branchId: {$eq: userBranchId} }];
    }
    return this.service.getMany(req);
  }



  @Override()
  async createOne(
    @Request() request: Request & {user: any},
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: MembershipGroup,
  ) {


    const branchId = request.user.selectedBranch.id;
    const membershipsToSave = dto.memberships;
    dto.memberships = null;

    if( dto.type == 'local') {
      dto.branchId = branchId;
    }
    const membershipGroup =  await this.service.createOne(req, dto);
    membershipsToSave.forEach( m => m.group = membershipGroup);
    membershipGroup.memberships = await this.membershipService.repo.save(membershipsToSave);
    membershipsToSave.forEach( m => m.group = null );
    return membershipGroup;
  }

}
