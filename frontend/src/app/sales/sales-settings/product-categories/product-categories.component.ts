import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ProductCategory} from '@models/product';
import {MatTableDataSource} from '@angular/material/table';
import {ProductService} from '../product-settings/product.service';
import {MatDialog} from '@angular/material/dialog';
import {ProductCategoriesCrudComponent} from './product-categories-crud/product-categories-crud.component';
import {DeletePromptDialogComponent} from '@shared/delete-prompt-dialog/delete-prompt-dialog.component';
import {remove} from 'lodash';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.component.scss']
})
export class ProductCategoriesComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<ProductCategory> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  columns = ['category', 'subcategories', 'edit', 'delete'];

  constructor(private productService: ProductService, private matDialog: MatDialog) {
  }

  ngOnInit(): void {
     this.dataSource.data = this.productService.getCategories();
  }

  openCrudDialog(productCategory: ProductCategory) {
    return this.matDialog.open(ProductCategoriesCrudComponent, {data: productCategory});
  }

  openDeletePromptDialog(category: ProductCategory) {
    this.matDialog.open(DeletePromptDialogComponent, {data: `Are you sure you want to remove ${category.name} ?`})
      .afterClosed().subscribe((doAction) => {
      if (doAction) {
        this.productService.removeCategory(category.id).toPromise().then(() => {
          remove(this.dataSource.data, categoryToRemove => categoryToRemove.id == category.id);
          this.dataSource.data = [...this.dataSource.data];
        });
      }
    });
  }

  _newProductCategory(): ProductCategory {
    return {id: 0, name: '', subcategories: [], description: ''};
  }

  addCategory() {
    this.openCrudDialog(this._newProductCategory()).afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.productService.saveCategory(result)
        .subscribe(newProductCategory =>
                  this.dataSource.data = [newProductCategory as ProductCategory, ...this.dataSource.data]);

    });
  }

  removeSubcategory(productCategoryIndex, subCategoryIndex) {
    const productCategories = this.dataSource.data;
    const subCategoryToRemove = productCategories[productCategoryIndex].subcategories[subCategoryIndex];
    productCategories[productCategoryIndex].subcategories.splice(subCategoryIndex, 1);
    this.productService.removeSubcategory(subCategoryToRemove.id).toPromise().then(() => {
      this.dataSource.data = [...productCategories];
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
