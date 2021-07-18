import { Injectable } from '@nestjs/common';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {ProductSubcategory} from './product-subcategory';

@Injectable()
export class ProductSubcategoryService extends TypeOrmCrudService<ProductSubcategory> {
  constructor(@InjectRepository(ProductSubcategory) public repo) {
    super(repo);
  }
}
