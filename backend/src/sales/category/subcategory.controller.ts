import {Controller, UseGuards} from '@nestjs/common';
import {Crud} from '@nestjsx/crud';
import {SubcategoryService} from './subcategory.service';
import {Subcategory} from './subcategory';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard';

@Crud({
  model: {
    type: Subcategory,
  },

})
@Controller('subcategory')
@UseGuards(JwtAuthGuard)
export class SubcategoryController {

  constructor(public service: SubcategoryService) {
  }


}
