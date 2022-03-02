import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {InventoryItem} from '../../invetory/inventory-list/inventory-item';

@Component({
  selector: 'view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.scss']
})
export class ViewItemComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public item: InventoryItem) { }

  ngOnInit(): void {
  }

  showSupplierInfo() {
    // console.log(' SHOW SUPPLIER INFO ' , this.product.purchaseVoucher);
  }
}
