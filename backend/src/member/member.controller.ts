import {Controller, Get, Param, Query, Req, UploadedFile, UseGuards} from '@nestjs/common';
import {Crud, CrudRequest, Override, ParsedBody, ParsedRequest} from '@nestjsx/crud';
import {Member} from './member';
import {MemberService} from './member.service';
import {FileUploadingUtils} from '../interceptors/file-uploading-utils.interceptor';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {Request} from 'express';
import {Between} from 'typeorm';

@Crud({
  model: {
    type: Member
  },

  query: {
    join: {
      referalMember: {
        eager: false
      },
      membershipPurchases: {
        eager: false
      },
      'membershipPurchases.membership': {
        alias: 'membership'
      },
      'membershipPurchases.members': {
        alias: 'membershipPurchaseMembers'
      },
      'membershipPurchases.freeze': {
        alias: 'membershipPurchaseFreeze'
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
  constructor(public service: MemberService) {

  }

  @Override()
  createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Member,
    @UploadedFile() image: any & UploadedImage,
  ) {
    dto.photoLink = image.path;
    return this.service.createOne(req, dto);
  }


  @Get('newMembersStatistic')
  async countNewMembers(@Req() request: Request, @Query('from') from: string, @Query('to') to: string ){
    const fromDate = new Date(parseInt(from));

    const toDate = new Date(parseInt(to));
   // console.log(typeof from, Date.now(), fromDate, toDate);
    // const condition:
   const res = await this.service.repo.count({where: {
      created: Between(fromDate, toDate)
      }});
   console.log(res);
   //  // return of([['Men', 200], ['Women', 250]]);
    return 1;
  }


}
