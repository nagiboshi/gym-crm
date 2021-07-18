import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ProductField} from './product-fields/product-field';
import {ProductCategory} from './product-category/product-category';
import {ProductSubcategory} from './product-category/product-subcategory';
import {Product} from './product/product';
import {ProductTag} from './tags/product-tag';
import {ProductPropertyService} from './product-property/product-property.service';
import {ProductFieldsService} from './product-fields/product-fields.service';
import {ProductService} from './product/product.service';
import {ProductFieldOption} from './product-property/product-field-option';
import {ProductPropertyController} from './product-property/product-property.controller';
import {ProductFieldsController} from './product-fields/product-fields.controller';
import {ProductController} from './product/product.controller';
import {ProductCategoryController} from './product-category/product-category.controller';
import {ProductCategoryService} from './product-category/product-category.service';
import {ProductSubcategoryService} from './product-category/product-subcategory.service';
import {ProductSubcategoryController} from './product-category/product-subcategory.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductField, ProductFieldOption, ProductCategory, ProductSubcategory, Product, ProductTag])],
  providers: [ProductPropertyService, ProductFieldsService, ProductService, ProductSubcategoryService, ProductCategoryService],
  controllers: [ProductPropertyController,ProductSubcategoryController, ProductFieldsController, ProductController, ProductCategoryController]
})
export class SalesModule {}
