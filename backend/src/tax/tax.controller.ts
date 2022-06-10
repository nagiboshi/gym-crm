import {Controller, UseGuards} from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {Tax} from './tax';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {TaxService} from './tax.service';

@Crud({
  model: {
    type: Tax
  },
})
@UseGuards(JwtAuthGuard)
@Controller('tax')
export class TaxController {


  constructor(private service: TaxService) {
  }

}
