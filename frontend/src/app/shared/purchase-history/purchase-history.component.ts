import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {MembershipPurchaseHistoryItem, ServicePurchaseModel} from '@models/membership-purchase';
import {FreezeMembershipDialogComponent} from '../freeze-membership-dialog/freeze-membership-dialog.component';
import {clone} from 'lodash';
import {MatDialog} from '@angular/material/dialog';
import {BehaviorSubject} from 'rxjs';
import * as _moment from 'moment';
import {SharePurchaseDialogComponent} from '@shared/share-purchase-dialog/share-purchase-dialog.component';
import {Member} from '@models/member';
import {SalesService} from '../../sales/sales.service';
import {ServicePurchaseFormComponent} from '../../sales/membership/service-purchase-form/service-purchase-form.component';
import {MemberSaleDialogComponent} from '../../sales/member-sale-dialog/member-sale-dialog.component';

const moment = _moment;


@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PurchaseHistoryComponent implements OnChanges {
  purchasesSubj: BehaviorSubject<MembershipPurchaseHistoryItem[]> = new BehaviorSubject([]);
  todayMoment = moment().startOf('day');

  @Output()
  purchaseUpdated: EventEmitter<MembershipPurchaseHistoryItem> = new EventEmitter();

  @Input()
  member: Member;


  ngOnChanges(changes: SimpleChanges): void {
    if( !changes.member?.previousValue || changes.member?.currentValue.id != changes.member?.previousValue.id ) {
        this.purchasesSubj.next(this.member.membershipPurchases?.map((purchaseItem) => {
          const {saleDate, startDate, ...rest} = <any> purchaseItem;
          return {saleDate: parseInt(saleDate), startDate: parseInt(startDate), ...rest};
        }).map(purchaseItem => this.salesService.toPurchaseHistoryItem(purchaseItem, this.todayMoment)));
    }
  }


  addNewPurchase() {
    this.dialog.open(MemberSaleDialogComponent, {data: this.member}).afterClosed().subscribe((purchaseHistoryItem: MembershipPurchaseHistoryItem) => {
        if (purchaseHistoryItem) {
          this.purchasesSubj.next([purchaseHistoryItem, ...this.purchasesSubj.getValue()]);
          this.purchaseUpdated.next(purchaseHistoryItem);
        }
    });

  }


  constructor(public dialog: MatDialog, private salesService: SalesService) {
  }

  freezePurchase(purchase: MembershipPurchaseHistoryItem) {
    // const freeze = !this.isFreezed(purchase);
    this.dialog.open(FreezeMembershipDialogComponent, {data: purchase}).afterClosed().subscribe((changedPurchase: MembershipPurchaseHistoryItem) => {
        if (changedPurchase) {
          this.salesService.savePurchase(this.salesService.toPurchaseItemModel(changedPurchase)).toPromise().then((savedPurchase) => {
              const purchases = this.purchasesSubj.getValue();
              const foundPurchaseIndex = purchases.findIndex( p => savedPurchase.id == p.id);

              if( foundPurchaseIndex != -1 ) {
                purchases[foundPurchaseIndex] = this.salesService.toPurchaseHistoryItem(savedPurchase, this.todayMoment);
                this.purchasesSubj.next([...purchases]);
                this.purchaseUpdated.next(purchases[foundPurchaseIndex]);
              }
          });
        }

      }
    );
  }

  sharePurchase(purchaseHistoryItem: MembershipPurchaseHistoryItem) {
    this.dialog.open(SharePurchaseDialogComponent, {data: purchaseHistoryItem}).afterClosed().subscribe((sharedMembers) => {

      if (sharedMembers) {
        const clonedPurchaseHistoryItem = clone(purchaseHistoryItem);
        clonedPurchaseHistoryItem.members = sharedMembers;
        const purchaseItemModel = this.salesService.toPurchaseItemModel(clonedPurchaseHistoryItem);
        this.salesService.savePurchase(purchaseItemModel).subscribe((purchaseItemModel) => {
          const updatedPurchase = this.salesService.toPurchaseHistoryItem(purchaseItemModel, this.todayMoment);
          const purchaseHistoryItems = this.purchasesSubj.getValue();

          const foundPurchaseIndex = purchaseHistoryItems.findIndex( p => p.id == updatedPurchase.id);
          if( foundPurchaseIndex != -1 ) {
            purchaseHistoryItems[foundPurchaseIndex] = updatedPurchase;
          } else {
            purchaseHistoryItems.unshift(updatedPurchase);
          }
          this.purchasesSubj.next([...purchaseHistoryItems]);
          this.purchaseUpdated.next(updatedPurchase);
        });
      }
    });
  }


}
