import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {InventoryItem} from '../../invetory/inventory-list/inventory-item';
import {Member} from '@models/member';
import {StockPurchase} from '@models/stock-purchase';

export interface StockPurchaseFormData {
  stock?: InventoryItem;
  member?: Member;
}

@Component({
  selector: 'stock-purchase-form-dialog',
  templateUrl: './stock-purchase-form-dialog.component.html',
  styleUrls: ['./stock-purchase-form-dialog.component.scss']
})
export class StockPurchaseFormDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: StockPurchaseFormData, private cdRef: MatDialogRef<StockPurchaseFormDialogComponent>) { }

  ngOnInit(): void {
  }

  sellStock(stockPurchase: StockPurchase) {
    this.cdRef.close(stockPurchase);
  }
}
