import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MembershipPurchaseHistoryItem} from '@models/membership-purchase';
import * as _moment from 'moment';
import {HelpersService} from '@shared/helpers.service';


const moment = _moment;

@Component({
  selector: 'app-freeze-membership-dialog',
  templateUrl: './freeze-membership-dialog.component.html',
  styleUrls: ['./freeze-membership-dialog.component.scss']
})
export class FreezeMembershipDialogComponent implements OnInit {
  now: number = moment.now();
  constructor(public dialog: MatDialogRef<FreezeMembershipDialogComponent>,
              public helpers: HelpersService,
              @Inject(MAT_DIALOG_DATA) public purchase: MembershipPurchaseHistoryItem) { }

  ngOnInit(): void {
    if( !this.purchase.freeze ) {
      this.purchase.freeze = {id: 0, note: "", startDate: moment.now(), endDate: null, purchaseId: this.purchase.id, totalDays: null};
    }
  }


  toggleFreeze() {
    const purchaseCopy = {...this.purchase};
      const prevFreeze = purchaseCopy.freeze;
      // updating existing freeze
      if( this.purchase.isFreezed ) {
        prevFreeze.endDate = moment.now();
        prevFreeze.totalDays =this.helpers.getTotalFreezeDays(prevFreeze.endDate, prevFreeze.startDate);
        prevFreeze.note = "";
      } else {
        prevFreeze.startDate = moment.now();
        prevFreeze.endDate = null;
      }

    this.dialog.close(purchaseCopy);
  }
}
