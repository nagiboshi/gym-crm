import {Controller} from '@nestjs/common';
import {Crud, CrudRequest, Override, ParsedBody, ParsedRequest} from '@nestjsx/crud';
import {ProductCategory} from './product-category';
import {ProductCategoryService} from './product-category.service';
import {ProductSubcategoryService} from './product-subcategory.service';

@Crud({
  model: {
    type: ProductCategory,
  },
  query: {
    join: {
      subcategories: {eager: false}
    }
  }
})
@Controller('product-category')
// @UseGuards(JwtAuthGuard)
export class ProductCategoryController {

  constructor( public service: ProductCategoryService, public subcategoryService: ProductSubcategoryService) {
  }


  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: ProductCategory,
  ) {
    const subcategoriesToSave = dto.subcategories;
    dto.subcategories = null;
    const productCategory =  await this.service.createOne(req, dto);
    subcategoriesToSave.forEach( m => m.category= productCategory);
    productCategory.subcategories = await this.subcategoryService.repo.save(subcategoriesToSave);
    subcategoriesToSave.forEach( m => m.category = null );
    return productCategory;
  }


}
