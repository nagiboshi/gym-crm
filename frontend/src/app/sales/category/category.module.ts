import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CategoriesCrudComponent} from './categories-crud/categories-crud.component';
import {CategoryListComponent} from './category-list.component';
import {SharedModule} from '@shared/shared.module';
import {SubcategoryCrudComponent} from './categories-crud/subcategory-crud.component/subcategory-crud.component';



@NgModule({
  declarations: [CategoriesCrudComponent,CategoryListComponent, SubcategoryCrudComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    CategoryListComponent
  ]
})
export class CategoryModule { }
