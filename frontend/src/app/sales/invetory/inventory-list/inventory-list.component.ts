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
import {ProductService} from '../../product/product.service';
import {ViewItemComponent} from '../../product/view-product/view-item.component';
import {ReportsService} from '../../../reports/reports.service';
import {HelpersService} from '@shared/helpers.service';
import {StockPurchaseFormDialogComponent} from '../../product/stock-purchase-form-dialog/stock-purchase-form-dialog.component';
@Component({
  selector: 'inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {
  apiPath = '/api/inventory';
  limit = 10;
  defaultProperties = ['color', 'size'];
  columns = ['name', ...this.defaultProperties, 'qty', 'basePrice', 'total', 'sell'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<InventoryItem>;

  constructor(private reportsService: ReportsService, private helpers: HelpersService, private http: HttpClient, private dialog: MatDialog, private stockPurchaseService: StockPurchaseService, private productService: ProductService) {
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

    this.stockPurchaseService.newPurchase$.subscribe( (productPurchase: StockPurchase) => {
      const tableData = this.dataSource.data;
      const prodIndex = tableData.findIndex( inventoryItem => inventoryItem.id == productPurchase.itemId);
      if( prodIndex != -1 ) {
        const foundProduct: InventoryItem = first(tableData.splice(prodIndex, 1));
        foundProduct.qty-=productPurchase.qty;
        tableData.splice(prodIndex, 0, foundProduct);
      }
    });
  }




  makeSalesReport() {
    const report = {...this.reportsService.reportsSub.getValue().find( r => r.name == 'Sales Report')};
    this.dialog.open(report.dialog, {data: {type: 'stock'}}).afterClosed().subscribe( f => report.func(f));
  }

  makeReport() {
      this.reportsService.generateValuationReport()
        .subscribe(blob => {
          this.helpers.download(blob, 'valuation-report.xls');
        });
  }

  openStockValuationReport() {
    const report = {...this.reportsService.reportsSub.getValue().find( r => r.name == 'Attendance Report')};
    report.func();
  }

  async sell(row: InventoryItem) {
    this.dialog.open(StockPurchaseFormDialogComponent, {data: {stock: row, member: null}}).afterClosed().subscribe((stockPurchase) => {
      if( stockPurchase ) {
        this.stockPurchaseService.save(stockPurchase);
      }
    });
  }

  async showProductDetails(row: InventoryItem) {
      // const product = await this.productService.getFullEntity(row.id);
      this.dialog.open(ViewItemComponent, {data: row});
  }

}
