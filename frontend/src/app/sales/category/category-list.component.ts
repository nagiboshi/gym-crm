import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {CategoriesCrudComponent} from './categories-crud/categories-crud.component';
import {DeletePromptDialogComponent} from '@shared/delete-prompt-dialog/delete-prompt-dialog.component';
import {remove} from 'lodash';
import {MatPaginator} from '@angular/material/paginator';
import {Category} from '@models/category';
import {CategoryService} from './category.service';

@Component({
  selector: 'category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Category> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  columns = ['category', 'subcategories', 'edit', 'delete'];

  constructor(private categoryService: CategoryService, private matDialog: MatDialog) {
  }

  ngOnInit(): void {
     this.categoryService.getCategories().then((categories) => {
       this.dataSource.data = categories;
     } );
  }

  openCrudDialog(category: Category) {
    return this.matDialog.open(CategoriesCrudComponent, {data: category});
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

  _newCategory(): Category {
    return {id: 0, name: '', subcategories: [], description: '', type: ''};
  }

  addCategory() {
    this.openCrudDialog(this._newCategory()).afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.categoryService.saveCategory(result)
        .then(newCategory =>
                  this.dataSource.data = [newCategory as Category, ...this.dataSource.data]);

    });
  }

  removeSubcategory(categoryIndex, subCategoryIndex) {
    const productCategories = this.dataSource.data;
    const subCategoryToRemove = productCategories[categoryIndex].subcategories[subCategoryIndex];
    productCategories[categoryIndex].subcategories.splice(subCategoryIndex, 1);
    this.categoryService.removeSubcategory(subCategoryToRemove.id).toPromise().then(() => {
      this.dataSource.data = [...productCategories];
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
