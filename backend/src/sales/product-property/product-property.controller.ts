import {Controller, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard';
import {ProductFieldOptionService} from './product-field-option.service';
import {Crud} from '@nestjsx/crud';
import {ProductFieldOption} from './product-field-option';

@Crud({
  model: {
    type: ProductFieldOption
  }
})
@Controller('product-property')
@UseGuards(JwtAuthGuard)
export class ProductPropertyController {

  constructor( public service: ProductFieldOptionService) {
  }

}
