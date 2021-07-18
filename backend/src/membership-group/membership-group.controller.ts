import {Controller, UseGuards} from '@nestjs/common';
import {CreateManyDto, Crud, CrudRequest, Override, ParsedBody, ParsedRequest} from '@nestjsx/crud';
import {MembershipGroup} from './membership-group';
import {MembershipGroupService} from './membership-group.service';
import {MembershipService} from './membership.service';
import {Membership} from './membership';
import {DeepPartial} from 'typeorm';
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
    ]
  },
})
@Controller('membershipGroup')
@UseGuards(JwtAuthGuard)
export class MembershipGroupController {

  constructor(public service: MembershipGroupService, public membershipService: MembershipService) {
  }


  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: MembershipGroup
  ) {
    const membershipsToSave = dto.memberships;
    dto.memberships = null;
    const membershipGroup =  await this.service.createOne(req, dto);
    membershipsToSave.forEach( m => m.group = membershipGroup);
    membershipGroup.memberships = await this.membershipService.repo.save(membershipsToSave);
    membershipsToSave.forEach( m => m.group = null );
    return membershipGroup;
  }

}
