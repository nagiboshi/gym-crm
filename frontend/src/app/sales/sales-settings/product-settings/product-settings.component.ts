import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
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
export class ProductSettingsComponent implements OnInit {
  columns = ['name', 'items', 'edit', 'delete'];
  limit = 10;
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
      console.log(product);
      if (product) {
        this.productService.saveProduct(product).then((r ) => {

          // console.log("HURRRA SAVED ! ", r);
        });

      }
    });
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Product>([]);
    this.productService.getProducts().subscribe( response => {
      this.dataSource.data = response.data;
      this.paginator.length = response.total;
    });
  }

  openDeletePromptDialog(product: Product) {
    this.dialog.open(DeletePromptDialogComponent, {data: `Are you sure you want to delete ${product.name} ?`}).afterClosed().subscribe(() => {
      this.productService.remove(product);
    });

  }

  onChangePage(ev: PageEvent) {
    const page = ev.pageIndex + 1;
      this.productService.getProducts(this.limit, page, '').subscribe( response => {
        this.dataSource.data = response.data;
      });
  }
}
