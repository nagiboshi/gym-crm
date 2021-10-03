import {Controller, UseGuards} from '@nestjs/common';
import {Crud, CrudRequest, Override, ParsedBody, ParsedRequest} from '@nestjsx/crud';
import {Category} from './category';
import {CategoryService} from './category.service';
import {SubcategoryService} from './subcategory.service';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard';

@Crud({
  model: {
    type: Category,
  },
  query: {
    join: {
      subcategories: {eager: false}
    }
  }
})
@Controller('category')
@UseGuards(JwtAuthGuard)
export class CategoryController {

  constructor(public service: CategoryService, public subcategoryService: SubcategoryService) {
  }


  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Category,
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
