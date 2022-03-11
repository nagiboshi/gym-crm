import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MembershipPurchaseHistoryItem} from '@models/membership-purchase';
import {Member} from '@models/member';
import {Router} from '@angular/router';
import {SharePurchaseDialogComponent} from '@shared/share-purchase-dialog/share-purchase-dialog.component';
import {clone} from 'lodash';
import {FreezeMembershipDialogComponent} from '@shared/freeze-membership-dialog/freeze-membership-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {SalesService} from '../../../sales/sales.service';
import * as moment from 'moment';
import {Moment} from 'moment';
import {HelpersService} from '@shared/helpers.service';

@Component({
  selector: 'membership-status',
  templateUrl: './membership-status.component.html',
  styleUrls: ['./membership-status.component.scss']
})
export class MembershipStatusComponent implements OnInit {
  @Input()
  member: Member;

  @Output()
  membershipUpdated: EventEmitter<MembershipPurchaseHistoryItem> = new EventEmitter<MembershipPurchaseHistoryItem>();

  @Input()
  activeMembership: MembershipPurchaseHistoryItem;
  todayMoment: Moment = moment();
  constructor(private router: Router, private dialog: MatDialog, private helpers: HelpersService, private salesService: SalesService) { }

  ngOnInit(): void {
  }


  sharePurchase(purchaseHistoryItem: MembershipPurchaseHistoryItem) {
    this.dialog.open(SharePurchaseDialogComponent, {data: purchaseHistoryItem}).afterClosed().subscribe((sharedMembers) => {

      if (sharedMembers) {
        const clonedPurchaseHistoryItem = clone(purchaseHistoryItem);
        clonedPurchaseHistoryItem.members = sharedMembers;
        const purchaseItemModel = this.salesService.toPurchaseItemModel(clonedPurchaseHistoryItem);
        this.salesService.savePurchase(purchaseItemModel).subscribe((purchaseItemModel) => {
          this.membershipUpdated.next(this.helpers.extendMembership(purchaseItemModel));
        });
      }
    });
  }

  freezePurchase(purchase: MembershipPurchaseHistoryItem) {
    // const freeze = !this.isFreezed(purchase);
    this.dialog.open(FreezeMembershipDialogComponent, {data: purchase}).afterClosed().subscribe((changedPurchase: MembershipPurchaseHistoryItem) => {
        if (changedPurchase) {
          this.salesService.savePurchase(this.salesService.toPurchaseItemModel(changedPurchase)).toPromise().then(( purchaseItemModel) => {
              const extendedMembership = this.helpers.extendMembership(purchaseItemModel);
              this.membershipUpdated.next(extendedMembership);
          });
        }

      }
    );
  }

  openMemberPage(sharedMember: Member) {
    this.router.navigate([`/members/profile/${sharedMember.id}`]);
  }
}
