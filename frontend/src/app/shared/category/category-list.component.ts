import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {CategoriesCrudComponent} from './categories-crud/categories-crud.component';
import {DeletePromptDialogComponent} from '@shared/delete-prompt-dialog/delete-prompt-dialog.component';
import {remove} from 'lodash';
import {MatPaginator} from '@angular/material/paginator';
import {Category, emptyCategory, Subcategory} from '@models/category';
import {CategoryService} from './category.service';
import {SubcategoryCrudComponent} from './categories-crud/subcategory-crud.component/subcategory-crud.component';
import {ActivatedRoute, Data} from '@angular/router';

type CategoryListType  = Data & {
  type: 'service'|'stock'
};



@Component({
  selector: 'category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Category> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  columns = ['category', 'subcategories', 'edit', 'delete'];
  type: 'service' | 'stock';
  constructor(private categoryService: CategoryService, private matDialog: MatDialog, private activatedRoute: ActivatedRoute) {
    activatedRoute.data.subscribe((data:CategoryListType) => {
      this.type = data.type;
      console.log(data);
      this.dataSource.data = this.categoryService.getCategories(this.type);
    });
  }

  ngOnInit(): void {
  }

  openCrudDialog(category: Category) {
    return this.matDialog.open(CategoriesCrudComponent, {width: '40vw', data: category});
  }

  openDeletePromptDialog(category: Category) {
    this.matDialog.open(DeletePromptDialogComponent, {data: `Are you sure you want to remove ${category.name} ?`})
      .afterClosed().subscribe((doAction) => {
      if (doAction) {
        this.categoryService.removeCategory(category.id).then(() => {
          remove(this.dataSource.data, categoryToRemove => categoryToRemove.id == category.id);
          this.dataSource.data = [...this.dataSource.data];
        });
      }
    });
  }

  editCategory(category: Category) {
    this.openCrudDialog(category).afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.categoryService.mergeCategory(result).then((updatedCategory) => {
        const idx = this.dataSource.data.findIndex(c => updatedCategory.id == c.id);
        const data = this.dataSource.data;
        data.splice(idx, 1, updatedCategory);
        this.dataSource.data = [...data];
      });
    });
  }

  addCategory() {
    this.openCrudDialog(emptyCategory(this.type)).afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.categoryService.mergeCategory(result).then((newCategory) => {
        this.dataSource.data = [newCategory as Category, ...this.dataSource.data];
      });
    });
  }

  removeSubcategory(categoryIndex, subCategoryIndex) {
    this.matDialog.open(DeletePromptDialogComponent, {data: `Are you sure?`}).afterClosed().subscribe((yes) => {
      if (yes) {
        const productCategories = this.dataSource.data;
        const subCategoryToRemove = productCategories[categoryIndex].subcategories[subCategoryIndex];
        this.categoryService.removeSubcategory(subCategoryToRemove.id).toPromise().then(() => {
          const subcategories =  productCategories[categoryIndex].subcategories;
          subcategories.splice(subCategoryIndex, 1);
        });
      }
    });

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  editSubcategory(categoryIndex: number, subcategoryIndex: number, subcategory: Subcategory) {

    if (!subcategory.category && subcategory.categoryId) {
      const productCategories = this.dataSource.data;
      subcategory.category = productCategories[categoryIndex];
    }


    this.matDialog.open(SubcategoryCrudComponent, {data: subcategory}).afterClosed().subscribe((editedSubcategory) => {

      if (editedSubcategory) {
        const productCategories = this.dataSource.data;
        const category = productCategories[categoryIndex];
        category.subcategories.splice(subcategoryIndex, 1, editedSubcategory);
        this.dataSource.data = [...productCategories];
        this.categoryService.mergeCategory(category);
      }
    });
  }
}
