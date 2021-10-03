import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CategoriesCrudComponent} from './categories-crud/categories-crud.component';
import {CategoryService} from './category.service';
import {CategoryListComponent} from './category-list.component';
import {SharedModule} from '@shared/shared.module';



@NgModule({
  declarations: [CategoriesCrudComponent,CategoryListComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    CategoryListComponent
  ]
})
export class CategoryModule { }
