import {Controller, UseGuards} from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {ClassCategory} from './class-category';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {ClassCategoryService} from './class-category.service';

@Crud({
  model: {
    type: ClassCategory
  }
})
@Controller('class-category')
@UseGuards(JwtAuthGuard)
export class ClassCategoryController {
  constructor(public service: ClassCategoryService) {
  }
}
