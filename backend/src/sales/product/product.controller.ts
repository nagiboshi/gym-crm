import {Controller, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard';
import {ProductService} from './product.service';
import {Crud, CrudRequest, Override, ParsedBody, ParsedRequest} from '@nestjsx/crud';
import {Product} from './product';
import {PropertyService} from '../properties/property.service';
import {PropertyValueService} from '../properties/property-value/property-value.service';


@Crud({
  model: {
    type: Product
  },
  query: {
    join: {
      properties: {eager: false},
      'properties.values': {eager: false, alias: 'propertyValues'},
      subcategory: {eager: false},
      'subcategory.category': {eager: false, alias: 'category'}
    },
    alwaysPaginate: true
  }
})
@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductController {

  constructor(public service: ProductService,
              public propertyService: PropertyService,
              public propertyValueService: PropertyValueService) {
  }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Product
  ) {

    for (let property of dto.properties) {
      property.values = await this.propertyValueService.repo.save(property.values);
    }

    dto.properties = await this.propertyService.repo.save(dto.properties);
    return await this.service.createOne(req, dto);
  }

}
