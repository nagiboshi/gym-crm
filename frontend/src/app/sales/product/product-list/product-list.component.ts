import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {DeletePromptDialogComponent} from '@shared/delete-prompt-dialog/delete-prompt-dialog.component';
import {Product} from '@models/product';
import {ProductCrudDialogComponent} from './product-crud-dialog/product-crud-dialog.component';
import {ProductService} from '../product.service';
import {CrudTableComponent} from '@shared/crud-table/crud-table.component';


@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent extends CrudTableComponent<ProductService, Product, ProductCrudDialogComponent> implements OnInit{
  limit = 10;
  columns = ['name', 'items', 'edit', 'delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private productService: ProductService, public dialog: MatDialog) {
    super(productService, ProductCrudDialogComponent);
  }

  ngOnInit() {
    super.init();
  }

  _newTableEntity(): Product {
    return {id: 0, name: '', photoLinks: [], properties: [{id: 0, name: 'Size', values: []}, {id: 0, name: 'Color', values: []}], subcategoryId: null, subcategory: null};
  }

}
