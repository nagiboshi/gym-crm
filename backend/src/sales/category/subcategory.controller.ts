import {Controller, Request, Get, UseGuards} from '@nestjs/common';
import {Crud, CrudRequest, ParsedRequest} from '@nestjsx/crud';
import {Category} from './category';
import {CategoryService} from './category.service';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard';
import {Subcategory} from './subcategory';
import {SubcategoryService} from './subcategory.service';
import {Property} from '../properties/property';

@Crud({
  model: {
    type: Subcategory,
  },
  query: {
  }
})
@Controller('subcategory')
@UseGuards(JwtAuthGuard)
export class SubcategoryController {

  constructor(public service: SubcategoryService) {

  }

}
