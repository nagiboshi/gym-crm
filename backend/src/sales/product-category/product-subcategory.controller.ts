import {Controller, UseGuards} from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {ProductSubcategoryService} from './product-subcategory.service';
import {ProductSubcategory} from './product-subcategory';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard';

@Crud({
  model: {
    type: ProductSubcategory,
  },

})
@Controller('product-subcategory')
// @UseGuards(JwtAuthGuard)
export class ProductSubcategoryController {

  constructor(public service: ProductSubcategoryService) {
  }


}
