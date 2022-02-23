import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {RequestQueryBuilder} from '@nestjsx/crud-request';
import {MatTableDataSource} from '@angular/material/table';
import {Observable} from 'rxjs';
import {Page} from '@models/page';
import {HttpClient} from '@angular/common/http';
import {InventoryItem} from './inventory-item';
import {StockPurchaseService} from '../../product/product-purchase-form/stock-purchase.service';
import {StockPurchase} from '@models/stock-purchase';
import {first} from 'lodash';
import {StockPurchaseFormComponent} from '../../product/product-purchase-form/stock-purchase-form.component';
import {ProductService} from '../../product/product.service';
import {ViewProductComponent} from '../../product/view-product/view-product.component';
import {SupplierViewComponent} from '../../suppliers/supplier-view/supplier-view.component';
import {Product} from '@models/product';
import {StockValuationReportComponent} from '../../../reports/stock-valuation-report/stock-valuation-report.component';
import {ReportsService} from '../../../reports/reports.service';
@Component({
  selector: 'inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {
  apiPath = '/api/inventory';
  limit = 10;
  defaultProperties = ['color', 'size']
  columns = ['name', ...this.defaultProperties, 'qty', 'basePrice', 'total', 'sell'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<InventoryItem>;

  constructor(private reportsService: ReportsService, private http: HttpClient, private dialog: MatDialog, private productPurchaseService: StockPurchaseService, private productService: ProductService) {
  }


  getPaged(limit: number = 10, page: number = 0, queryBuilder?: RequestQueryBuilder): Observable<Page<InventoryItem>> {
    if (!queryBuilder) {
      queryBuilder = RequestQueryBuilder.create();
    }
    queryBuilder.setLimit(limit);
    queryBuilder.setPage(page);
    queryBuilder.sortBy({field: 'id', order: 'DESC'});
    const path = '?' + queryBuilder.query(false);
    return this.http.get<Page<InventoryItem>>(`${this.apiPath}${path}`);
  }

  onChangePage(ev: PageEvent) {
    const page = ev.pageIndex + 1;
    this.getPaged(this.limit, page).subscribe(response => {
      this.dataSource.data = response.data;
    });
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<InventoryItem>([]);
    this.getPaged(this.limit, 0).subscribe(response => {
      this.dataSource.data = response.data;
      this.paginator.length = response.total;
    });

    this.productPurchaseService.newPurchase$.subscribe( (productPurchase: StockPurchase) => {
      const tableData = this.dataSource.data;
      const prodIndex = tableData.findIndex( inventoryItem => inventoryItem.id == productPurchase.itemId);
      if( prodIndex != -1 ) {
        const foundProduct = first(tableData.splice(prodIndex, 1));
        foundProduct.qty-=productPurchase.qty;
        tableData.splice(prodIndex, 0, foundProduct);
      }
    });
  }



  makeReport() {
      this.reportsService.generateValuationReport()
        .subscribe(blob => {
          const a = document.createElement('a')
          const objectUrl = URL.createObjectURL(blob)
          a.href = objectUrl
          a.download = 'valuation-report.xls';
          a.click();
          URL.revokeObjectURL(objectUrl);
        });
  }

  openStockValuationReport() {
    this.dialog.open(StockValuationReportComponent);
  }

  async sell(row: InventoryItem) {
    const product = await this.productService.getFullEntity(row.id);
    this.dialog.open(StockPurchaseFormComponent, {data: product});
  }

  async showProductDetails(row: InventoryItem) {
      const product = await this.productService.getFullEntity(row.id);
      this.dialog.open(ViewProductComponent, {data: product});
  }


}
