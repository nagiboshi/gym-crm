import {Controller} from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {Package} from './package';
import {InjectRepository} from '@nestjs/typeorm';
import {MemberService} from '../member/member.service';
import {PackageService} from './package.service';

@Crud({
  model: {
    type: Package,
  },
  query: {
    join: {
      items: {
        eager: true
      }
    }
  },
})
@Controller('package')
export class PackageController{

  constructor(public service: PackageService) {
  }
}
