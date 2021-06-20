import {Controller, UploadedFile, UseGuards} from '@nestjs/common';
import {Crud, CrudRequest, Override, ParsedBody, ParsedRequest} from '@nestjsx/crud';
import {User} from './user';
import {FileUploadingUtils} from '../interceptors/file-uploading-utils.interceptor';
import {UserService} from './user.service';
import * as bcrypt from 'bcrypt';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';

@Crud({
  model: {type: User},
  routes: {
    createOneBase: {
      interceptors: [FileUploadingUtils.singleFileUploader('image')],
    }
  },
})
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {

  constructor(public service: UserService) {
  }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: User,
    @UploadedFile() image: any & UploadedImage,
  ) {
    try {
      dto.password = await bcrypt.hash(dto.password, 10);
      dto.photoLink = image.path;
      return this.service.createOne(req, dto);
    } catch (e) {
      throw e;
    }
  }
}
