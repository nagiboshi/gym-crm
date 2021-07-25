import {Controller, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard';
import {ProductFieldsService} from './product-fields.service';
import {Crud} from '@nestjsx/crud';
import {ProductField} from './product-field';

@Crud({
  model: {
    type: ProductField
  },
  query: {
    join: {
      options: {eager: false}
    }
  }
})
@Controller('product-fields')
@UseGuards(JwtAuthGuard)
export class ProductFieldsController {

  constructor( public service: ProductFieldsService) {
  }

}
