import {Controller, UploadedFile, UseGuards} from '@nestjs/common';
import {Crud, CrudRequest, Override, ParsedBody, ParsedRequest} from '@nestjsx/crud';
import {Member} from './member';
import {MemberService} from './member.service';
import {FileUploadingUtils} from '../interceptors/file-uploading-utils.interceptor';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {AuthGuard} from '@nestjs/passport';


@Crud({
  model: {
    type: Member
  },

  query: {
    join: {
      referalMember: {
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
}
