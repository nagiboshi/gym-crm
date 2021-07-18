import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {DeletePromptDialogComponent} from '@shared/delete-prompt-dialog/delete-prompt-dialog.component';
import {ProductService} from './product.service';
import {Product} from '@models/product';
import {ProductCrudDialogComponent} from './product-crud-dialog/product-crud-dialog.component';

@Component({
  selector: 'app-product-settings',
  templateUrl: './product-settings.component.html',
  styleUrls: ['./product-settings.component.scss']
})
export class ProductSettingsComponent implements OnInit, AfterViewInit {
  columns = ['name', 'items', 'edit', 'delete'];
  dataSource: MatTableDataSource<Product>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  packageUpdateSub: Subscription;

  constructor(private productService: ProductService, private dialog: MatDialog) {
  }

  _newProduct(): Product {
    return {id: 0, name: '', photoLinks: [], price: 0, fields: [], subcategory: null, tags: []};
  }

  openCrudDialog(product?: Product) {
    const tempProduct = product ? product : this._newProduct();
    this.dialog.open(ProductCrudDialogComponent, {data: tempProduct, minWidth: '80vw'}).afterClosed().subscribe((product: Product) => {
      if (product) {
        this.productService.save(product);
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Product>([]);
    this.packageUpdateSub = this.productService.getProducts().subscribe( products => this.dataSource.data = products);
  }

  openDeletePromptDialog(product: Product) {
    this.dialog.open(DeletePromptDialogComponent, {data: `Are you sure you want to delete ${product.name} ?`}).afterClosed().subscribe(() => {
      this.productService.remove(product);
    });

  }

}
