import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Property} from './properties/property';
import {Stock} from './stock/stock';
import {PropertyService} from './properties/property.service';
import {StockService} from './stock/stock.service';
import {PropertyController} from './properties/property.controller';
import {StockController} from './stock/stock.controller';
import {Category} from './category/category';
import {Subcategory} from './category/subcategory';
import {CategoryService} from './category/category.service';
import {SubcategoryService} from './category/subcategory.service';
import {CategoryController} from './category/category.controller';
import {SubcategoryController} from './category/subcategory.controller';
import {PropertyValueService} from './properties/property-value/property-value.service';
import {PropertyValue} from './properties/property-value/property-value';
import { SupplierController } from './supplier/supplier.controller';
import { SupplierService } from './supplier/supplier.service';
import {Supplier} from './supplier/supplier';
import {ProductController} from './product/product.controller';
import {ProductService} from './product/product.service';
import {Product} from './product/product';

@Module({
  imports: [TypeOrmModule.forFeature([Property, Product, Supplier, PropertyValue, Category, Subcategory, Stock])],
  providers: [PropertyValueService, ProductService, PropertyService,  StockService, CategoryService, SubcategoryService, SupplierService],
  controllers: [PropertyController, ProductController, CategoryController, SubcategoryController, PropertyController, StockController, SupplierController]
})
export class SalesModule {}
