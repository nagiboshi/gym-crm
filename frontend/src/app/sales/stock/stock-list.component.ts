import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {DeletePromptDialogComponent} from '@shared/delete-prompt-dialog/delete-prompt-dialog.component';
import {StockService} from './stock.service';
import {Stock} from '@models/stock';
import {HelpersService} from '@shared/helpers.service';
import {remove} from 'lodash';
import {StockPurchaseFormComponent} from './stock-purchase-form/stock-purchase-form.component';
import {FormControl} from '@angular/forms';
import {StockPurchase} from '@models/stock-purchase';




@Component({
  selector: 'stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.scss'],

})
export class StockListComponent implements OnInit, AfterViewInit {
  columns = [ 'name', 'category', 'subcategory', 'inventory', 'delete'];
  limit = 10;
  dataSource: MatTableDataSource<Stock>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private helpers: HelpersService, private stockService: StockService, private dialog: MatDialog) {
  }

  // _newStock(): Stock {
  //   return {id: 0, product: null, subcategory: null, qty: 0, price: 0, details: []};
  // }

  openCrudDialog(stock?: Stock) {
    // const tempStock = stock ? stock : this._newStock();
    // this.dialog.open(StockCrudDialogComponent, {data: tempStock, minWidth: '600px'}).afterClosed().subscribe((stock: Stock) => {
    //   if (stock) {
    //     this.stockService.saveStock(stock).then((savedStock ) => {
    //       this.dataSource.data = [savedStock, ...this.dataSource.data];
    //     });
    //
    //   }
    // });
  }

  ngAfterViewInit() {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Stock>([]);
    // this.dataSource.data = [{name: 'Kids Kimono', category: 'Clothes', subcategory: 'Kimonos', qty: 1, id: 1, properties: [], price: 100},
    //   {name: 'Belt', category: 'Clothes', subcategory: 'Kimonos', qty: 1, id: 1, properties: [], price: 100},
    //   {name: 'Chocolate Bar', category: 'Food', subcategory: 'Sweets', qty: 1, id: 1, properties: [], price: 100}
    // ];
    this.stockService.getStocks().subscribe(response => {

      this.dataSource.data = response.data;
      this.paginator.length = response.total;
    });
  }

  openDeletePromptDialog(stock: Stock) {
    this.dialog.open(DeletePromptDialogComponent, {data: `Are you sure you want to delete ${stock.product.name} ?`}).afterClosed().subscribe(() => {
      this.stockService.remove(stock).then(() => {
        const stockData = this.dataSource.data;
        remove(stockData, p => p.id == stock.id);
        this.dataSource.data = [...stockData];
        // this.pr
      });
    });

  }

  onChangePage(ev: PageEvent) {
    const page = ev.pageIndex + 1;
      this.stockService.getStocks(this.limit, page, '').subscribe(response => {
        this.dataSource.data = response.data;
      });
  }

  addNewPurchase() {
    this.dialog.open(StockPurchaseFormComponent, { width: '80%', minHeight: '80%'}).afterClosed().subscribe((purchase: StockPurchase) => {
        console.log(purchase);
    });
  }

  async updateStockQty(stock: Stock, qtyControl: FormControl ) {
    if( qtyControl.valid ) {
     const updatedStock = await this.stockService.updateStock(stock.id, {qty: qtyControl.value});
     const existingStocks = this.dataSource.data;
     const stockToUpdate = existingStocks.find( stock => stock.id == updatedStock.id );
     stockToUpdate.qty = updatedStock.qty;
     this.dataSource.data = [...existingStocks];
      qtyControl.reset(updatedStock.qty);
    }
  }

  async sellStock(stock: Stock) {
    stock = await this.stockService.getStockWithProperties(stock.id).toPromise();
    this.dialog.open(StockPurchaseFormComponent, { data: stock, width: '40%', minHeight: '80%'}).afterClosed().subscribe((purchase) => {
      this.stockService.sellStock(purchase).then((response)=> console.log('Stock PURCHASE', response));
    });
  }
}
