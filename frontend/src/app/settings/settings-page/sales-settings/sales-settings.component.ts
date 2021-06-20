import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommunicationService} from '@shared/communication.service';
import {ProductCategory} from '@models/product-category';
import {BehaviorSubject, Observable, of, Subscription} from 'rxjs';
import {concatMap, flatMap, last, map, mergeMap, reduce, scan, take, takeLast, toArray} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {SalesDialogComponent} from './sales-dialog/sales-dialog.component';
import {MatTableDataSource} from '@angular/material/table';
import {ClassModel} from '../../../classes/class.model';
import {MatPaginator} from '@angular/material/paginator';
import {DeletePromptDialogComponent} from '@shared/delete-prompt-dialog/delete-prompt-dialog.component';
import {ProductCategoriesService} from '@shared/product-categories.service';

@Component({
  selector: 'sales-settings',
  templateUrl: './sales-settings.component.html',
  styleUrls: ['./sales-settings.component.scss']
})
export class SalesSettingsComponent implements OnInit, AfterViewInit{
  columns = ['name', 'items', 'edit', 'delete'];
  dataSource: MatTableDataSource<ProductCategory>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  packageUpdateSub: Subscription;

  constructor(private productService: ProductCategoriesService, private dialog: MatDialog) {
  }

  _newProductCategory(): ProductCategory {
    return {products: [], id: 0, name: '', type: 0};
  }

  openSalesDialog(productCategory?: ProductCategory) {
    const tempProductCategory = productCategory ? productCategory : this._newProductCategory();
    this.dialog.open(SalesDialogComponent, {data: tempProductCategory}).afterClosed().subscribe((productCategoryToSave: ProductCategory) => {
      if (productCategoryToSave) {
        this.productService.saveProductCategory(productCategoryToSave);
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<ProductCategory>([]);
    this.packageUpdateSub = this.productService.getProductCategory$().subscribe(productCategories => this.dataSource.data = productCategories);
  }

  openDeletePromptDialog(productCategory: ProductCategory) {
    this.dialog.open(DeletePromptDialogComponent, {data: `Are you sure you want to delete ${productCategory.name} ?`}).afterClosed().subscribe(() => {
      this.productService.removeProductCategory(productCategory);
    });

  }
}
