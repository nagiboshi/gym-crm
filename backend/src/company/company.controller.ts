import {Controller} from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {Company} from './company';
import {CompanyService} from './company.service';

@Crud({
  model: {
    type: Company
  }
})
@Controller('company')
export class CompanyController {

  constructor(public service: CompanyService) {
  }


}
