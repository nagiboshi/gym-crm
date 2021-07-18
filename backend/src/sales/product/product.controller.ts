import {Controller, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard';
import {ProductService} from './product.service';
import {Crud} from '@nestjsx/crud';
import {Product} from './product';

@Crud({
  model: {
    type: Product}
})
@Controller('product')
// @UseGuards(JwtAuthGuard)
export class ProductController {

  constructor( public service: ProductService) {
  }

}
