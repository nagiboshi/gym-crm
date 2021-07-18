import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {ProductCategory} from './product-category';

@Injectable()
export class ProductCategoryService extends TypeOrmCrudService<ProductCategory> {
  constructor(@InjectRepository(ProductCategory) public repo) {
    super(repo);
  }
}
