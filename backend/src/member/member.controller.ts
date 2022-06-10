import {
  Controller,
  ForbiddenException,
  Query,
  Request,
  UploadedFile,
  UseGuards
} from '@nestjs/common';
import {Crud, CrudRequest, Override, ParsedBody, ParsedRequest} from '@nestjsx/crud';
import {Member} from './member';
import {MemberService} from './member.service';
import {FileUploadingUtils} from '../interceptors/file-uploading-utils.interceptor';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {SocialNetworkAccountService} from '../social-network-account/social-network-account.service';
import {Equal} from 'typeorm';
import {RuntimeException} from '@nestjs/core/errors/exceptions/runtime.exception';

@Crud({
  model: {
    type: Member
  },

  query: {
    alwaysPaginate: true,
    join: {
      referalMember: {
        eager: false
      },
      membershipPurchases: {
        eager: false
      },
      activeMembership: {
        eager: false
      },
      'activeMembership.membership': {
        alias: 'activeMembershipInfo',
        eager: false
      },
      'activeMembership.payments': {
        alias: 'activeMembershipPayments',
        eager: false
      },
      'activeMembership.members': {
        alias: 'activeMembershipMembers',
        eager: false
      },
      'activeMembership.freeze': {
        alias: 'freezeMembership',
        eager: false
      },
      socialAccounts: {
        eager: false
      }
    }
  },
  routes: {
    createOneBase: {
      interceptors: [FileUploadingUtils.singleFileUploader('image')],
    }
  },
})
@Controller('member')
@UseGuards(JwtAuthGuard)
export class MemberController {
  constructor(public service: MemberService, public socialNetworkAccService: SocialNetworkAccountService) {

  }

  @Override()
  getMany(
    @Request() request: Request & {user: any},
    @ParsedRequest() req: CrudRequest,
    @Query() query: {type: string}
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
  createOne(
    @Request() request,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Member,
    @UploadedFile() image: any & UploadedImage,
  ) {

    if( dto.type == 'local') {
      dto.branchId = request.user.selectedBranch.id;
    }
    if (image?.path) {
      dto.photoLink = image.path;
    }

    return this.service.createOne(req, dto);
  }

  @Override()
  async getOne(
    @Request() request,
    @ParsedRequest() req: CrudRequest
  ) {
    const userBranchId = request.user.selectedBranch.id;
    const member: Member = await this.service.getOne(req);
    if( member.type == 'local' && member.branchId != userBranchId) {
      throw new ForbiddenException();
    }
    return member;
  }

  @Override('updateOneBase')
  async updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Member,
  ) {
    let socialAccounts = dto.socialAccounts;
    if (socialAccounts && socialAccounts.length > 0) {
      socialAccounts.forEach(socialAccount => socialAccount.memberId = dto.id);
      const existingSocialAccounts = await this.socialNetworkAccService.repo.find({where: {memberId: Equal( dto.id)}});

      await this.socialNetworkAccService.repo.remove(existingSocialAccounts);
      dto.socialAccounts = await this.socialNetworkAccService.repo.save(socialAccounts);
    }
    return await this.service.updateOne(req, dto);
  }

}
