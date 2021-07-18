import {Component, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MembershipPurchaseHistoryItem} from '@models/purchase';
import {Member} from '@models/member';

@Component({
  selector: 'app-share-purchase-dialog',
  templateUrl: './share-purchase-dialog.component.html',
  styleUrls: ['./share-purchase-dialog.component.scss']
})
export class SharePurchaseDialogComponent implements OnInit {
  sharedMembers: Member[] = [];

  constructor( @Inject(MAT_DIALOG_DATA) public membershipPurchaseItem: MembershipPurchaseHistoryItem) { }

  ngOnInit(): void {
    this.membershipPurchaseItem.members.forEach(member => this.sharedMembers.push(member));
  }

  addMemberToShared(member: Member) {
      const doesMemberSharedAlready = this.sharedMembers.find(m => m.id == member.id);
      if (!doesMemberSharedAlready) {
        this.sharedMembers.push(member);
      }
    }
}
