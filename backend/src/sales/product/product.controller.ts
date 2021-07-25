import {Controller, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard';
import {ProductService} from './product.service';
import {Crud, CrudRequest, Override, ParsedBody, ParsedRequest} from '@nestjsx/crud';
import {Product} from './product';
import {MembershipGroup} from '../../membership-group/membership-group';
import {ProductFieldsService} from '../product-fields/product-fields.service';
import {TagService} from '../tags/tag.service';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {ProductField} from '../product-fields/product-field';
import {Repository} from 'typeorm';
import {ProductFieldOptionService} from '../product-property/product-field-option.service';


@Crud({
  model: {
    type: Product
  },
  query: {
    join: {
      fields: {eager: false},
      'fields.options': {eager: false, alias: 'fieldOptions'},
      tags: {eager: false}
    },
    alwaysPaginate: true

  }
})
@Controller('product')
// @UseGuards(JwtAuthGuard)
export class ProductController {

  constructor(public service: ProductService,
              public productFieldService: ProductFieldsService,
              public productFieldOptionService: ProductFieldOptionService,
              public productTagService: TagService) {
  }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Product
  ) {

    dto.tags = await this.productTagService.repo.save(dto.tags);

    for( let field of dto.fields) {
      field.options = await this.productFieldOptionService.repo.save(field.options);
    }

    dto.fields = await this.productFieldService.repo.save(dto.fields);
    return await this.service.createOne(req, dto);
  }

}
