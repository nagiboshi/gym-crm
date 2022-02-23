import {Body, Controller, Logger, UploadedFiles, UseGuards} from '@nestjs/common';
import {ProductService} from './product.service';
import {Crud, CrudRequest, Override, ParsedBody, ParsedRequest} from '@nestjsx/crud';
import {Product, ProductSubmit} from './product';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard';
import {FileUploadingUtils} from '../../interceptors/file-uploading-utils.interceptor';
import * as dot from 'dot-object';
import {plainToClass} from 'class-transformer';
import {PropertyService} from '../properties/property.service';
import {PropertyValueService} from '../properties/property-value/property-value.service';
import {QueryFields, QueryFilter, QueryJoin, QuerySort, SCondition} from '@nestjsx/crud-request/lib/types';
import {ObjectLiteral} from '@nestjsx/util';
@Crud({
  model: {
    type: Product
  },
  query: {
    join: {
       properties: {eager: false},
      'properties.values': {eager: false, alias: 'propertyValues'},
    },
  },
  routes: {
    createOneBase: {
      interceptors: [FileUploadingUtils.multipleFileUploader('images[]')],
    }
  }
})
@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(public service: ProductService, private propertyService: PropertyService, private propertyValueService: PropertyValueService) {
  }


  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @Body() body: any,
    @UploadedFiles() images: Array<any & UploadedImage>) {
    const productObj: object = dot.object(body);
    const productSubmit: ProductSubmit = plainToClass(ProductSubmit, productObj, {enableImplicitConversion: true});

    images.forEach( img => {
      if( !productSubmit.images ) {
        productSubmit.images = [];
      }
      productSubmit.images.push(img.path);
    });

    productSubmit.properties = await this.propertyService.saveBatch(productSubmit.properties);
    return this.service.createOne(req, productSubmit as any);
  }


}
