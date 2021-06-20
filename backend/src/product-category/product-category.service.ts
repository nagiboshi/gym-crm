import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {ProductCategory} from './product-category';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class ProductCategoryService extends TypeOrmCrudService<ProductCategory>{

  constructor(@InjectRepository(ProductCategory) repo) {
    super(repo);
  }


}
