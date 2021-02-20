import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {PurchaseItem} from '../../models/purchase.model';

@Component({
  selector: 'app-freeze-membership-dialog',
  templateUrl: './freeze-membership-dialog.component.html',
  styleUrls: ['./freeze-membership-dialog.component.scss']
})
export class FreezeMembershipDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public purchaseItem: PurchaseItem) { }

  ngOnInit(): void {
  }

}
