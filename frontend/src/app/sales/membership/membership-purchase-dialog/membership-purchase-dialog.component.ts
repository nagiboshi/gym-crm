import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'membership-purchase-dialog',
  templateUrl: './membership-purchase-dialog.component.html',
  styleUrls: ['./membership-purchase-dialog.component.scss']
})
export class MembershipPurchaseDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<MembershipPurchaseDialogComponent>) { }

  ngOnInit(): void {
  }

  servicePurchase($event: any) {

  }
}
