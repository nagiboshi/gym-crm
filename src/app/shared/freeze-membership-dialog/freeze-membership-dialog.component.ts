import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PurchaseItem} from '../../models/purchase.model';

@Component({
  selector: 'app-freeze-membership-dialog',
  templateUrl: './freeze-membership-dialog.component.html',
  styleUrls: ['./freeze-membership-dialog.component.scss']
})
export class FreezeMembershipDialogComponent implements OnInit {

  constructor(public dialog: MatDialogRef<FreezeMembershipDialogComponent>, @Inject(MAT_DIALOG_DATA) public purchase: PurchaseItem) { }

  ngOnInit(): void {
  }

  toggleFreeze() {
    const toggledPurchase = {...this.purchase};
    toggledPurchase.isFreezed = !toggledPurchase.isFreezed;
    this.dialog.close(toggledPurchase);
  }
}
