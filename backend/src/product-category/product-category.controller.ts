import {Controller} from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {ProductCategory} from './product-category';
import {ProductCategoryService} from './product-category.service';

@Crud({
  model: {
    type: ProductCategory,
  },
  query: {
    join: {
      products: {
        eager: true
      },
    }
  },
})
@Controller('productCategory')
export class ProductCategoryController {

  constructor(public service: ProductCategoryService) {
  }
}
