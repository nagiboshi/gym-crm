import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Product} from '@models/product';

@Component({
  selector: 'view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public product: Product) { }

  ngOnInit(): void {
  }

  showSupplierInfo() {
    // console.log(' SHOW SUPPLIER INFO ' , this.product.purchaseVoucher);
  }
}
