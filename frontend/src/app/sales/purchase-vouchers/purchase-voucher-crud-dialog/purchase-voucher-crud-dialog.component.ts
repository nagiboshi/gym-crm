import {Component, Inject, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {PurchaseVoucher} from '../purchase-voucher';
import {Supplier} from '@models/supplier';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import * as _moment from 'moment'
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {Stock} from '@models/stock';
import {StockCrudDialogComponent} from '../stock-crud-dialog/stock-crud-dialog.component';
let moment  = _moment;
@Component({
  selector: 'purchase-voucher-crud-dialog',
  templateUrl: './purchase-voucher-crud-dialog.component.html',
  styleUrls: ['./purchase-voucher-crud-dialog.component.scss']
})
export class PurchaseVoucherCrudDialogComponent implements OnInit {
  dataSource: MatTableDataSource<PurchaseVoucher>;
  selectedSupplier: Supplier = null;
  columns = ['productId','name', 'qty', 'delete'];
  formArray: FormArray;
  date: number;
  dueDate: Date;
  form: FormGroup;


  constructor(@Inject(MAT_DIALOG_DATA) public purchaseVoucher: PurchaseVoucher, private dialog: MatDialog, private fb: FormBuilder) {
  }


  ngOnInit(): void {
    //
    // if(!this.purchaseVoucher){
    //   const emptyStocks: Stock[] = [1,2,3,4,5].map<Stock>( (_, idx, arr) => { return {id: 0, qty: 0, product: null, details: null, images: [], price: 0  }});
    //   this.purchaseVoucher = {id: 0, from: moment.now(), to: null, qty: 5, stocks: emptyStocks, supplier: this.selectedSupplier};
    // }
    this.dataSource = new MatTableDataSource<PurchaseVoucher>([]);
    this.formArray = new FormArray([]);
    this.date = moment.now();
    this.form = this.fb.group({});
  }

  addNewItem() {


    this.dialog.open(StockCrudDialogComponent, {});
    // const fg = this.fb.group({
    //
    // });
    // id: number;
    // from: number;
    // to?: number;
    // supplier: Supplier;
    // qty: number;
    // stocks: Stock[];
    // this.formArray.push()
  }


  submitVoucher() {
    let purchaseVoucher: Partial<PurchaseVoucher> = {};

    purchaseVoucher.id = 0;
    purchaseVoucher.supplier = this.selectedSupplier;
    purchaseVoucher.stocks = [];
    // purchaseVoucher.from = this.
  }


  supplierSelected(supplier: Supplier) {
    this.selectedSupplier = supplier;
  }

  openDeletePromptDialog(row) {

  }

  removeSupplier() {
    this.selectedSupplier = null;
  }
}
