import {Controller, UseGuards} from '@nestjs/common';
import {Crud, CrudRequest, Override, ParsedBody, ParsedRequest} from '@nestjsx/crud';
import {Category} from './category';
import {CategoryService} from './category.service';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard';
import {SubcategoryService} from './subcategory.service';
import {PropertyService} from '../properties/property.service';
import {isEmpty} from 'lodash';
import {Subcategory} from './subcategory';
@Crud({
  model: {
    type: Category,
  },
  query: {
    join: {
      subcategories: {eager: false},
      'subcategories.properties': {eager: false, alias: 'subcategoryProperties'},
      'subcategories.properties.values': {eager: false, alias: 'propertyValues'},
      'subcategories.category': {eager: false, alias: 'subcategoryCategory'}
    }
  }
})
@Controller('category')
@UseGuards(JwtAuthGuard)
export class CategoryController {

  constructor(public service: CategoryService, public subcategoryService: SubcategoryService, public propertiesService: PropertyService) {
  }

  prepareBulkData(field: string, cat: Category): any[] {
    let bulkData = null;
    if (!isEmpty(cat[field])) {
      bulkData = cat[field];
      cat[field] = [];
    }
    return bulkData;
  }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() category: Category) {

    let subcategories: Subcategory[] = this.prepareBulkData('subcategories', category);
    const savedCategory = await this.service.createOne(req, category);
    subcategories = await Promise.all(subcategories.map(async sub => {
      sub.category = savedCategory;
      let subcategoryProperties = sub.properties;
      sub.properties = [];
      const createdSub: Subcategory = await this.subcategoryService.repo.save(sub);
      if( !isEmpty(subcategoryProperties) ) {
        subcategoryProperties.forEach(p => p.subcategory = createdSub);
        subcategoryProperties = await this.propertiesService.saveBatch(subcategoryProperties);
        // To avoid Maximum call stack size exceeded error
        subcategoryProperties.forEach( p => p.subcategory = null);
        createdSub.properties = subcategoryProperties;
      }
      createdSub.category = null;
      return createdSub;
    }));
    savedCategory.subcategories = subcategories;
    return savedCategory;
  }


}
