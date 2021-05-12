import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PurchaseHistoryItem, PurchaseItem, toPurchaseHistoryItem} from '../../models/purchase';
import {FreezeMembershipDialogComponent} from '../freeze-membership-dialog/freeze-membership-dialog.component';
import {Freeze} from '../../models/freeze';
import {CommunicationService} from '../communication.service';
import {MatDialog} from '@angular/material/dialog';
import {PurchaseFormComponent} from '../../sales/purchase-form/purchase-form.component';
import {BehaviorSubject, forkJoin, Observable, of} from 'rxjs';
import * as _moment from 'moment';
import {combineAll, concatAll, concatMap, map, mapTo} from 'rxjs/operators';

const moment = _moment;



@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PurchaseHistoryComponent implements OnInit {
  purchasesSubj: BehaviorSubject<PurchaseHistoryItem[]> = new BehaviorSubject(null);
  todayMoment = moment().startOf('day');
  @Input()
  memberId: number;

  ngOnInit(): void {
    const memberPurcases$ = this.communicationService.getMemberPurchases(this.memberId)
      .pipe(
        concatMap((purchaceItems) => of(...purchaceItems)),
        map<PurchaseItem, Observable<PurchaseHistoryItem>>((purchaseItem: PurchaseItem, _: number) => {
        return of(toPurchaseHistoryItem({...purchaseItem}, this.todayMoment));
    }));

    memberPurcases$.pipe(combineAll<PurchaseHistoryItem>()).subscribe((res) => {
        this.purchasesSubj.next(res);
      });

  }

  addNewPurchase() {
    this.dialog.open(PurchaseFormComponent, {data: this.memberId}).afterClosed().subscribe((purchase: PurchaseItem) => {
      if (purchase) {
        const savedPurchaseItem = this.communicationService.savePurchase(purchase);
        savedPurchaseItem.toPromise().then((purchaseItem) => {
          this.purchasesSubj.next([toPurchaseHistoryItem(purchaseItem, this.todayMoment), ...this.purchasesSubj.getValue()]);
        });
      }
    });
  }


  constructor(public dialog: MatDialog, private communicationService: CommunicationService) {
  }

  freezePurchase(purchase: PurchaseItem) {
    // const freeze = !this.isFreezed(purchase);
    this.dialog.open(FreezeMembershipDialogComponent, {data: purchase}).afterClosed().subscribe((changedPurchase: PurchaseItem) => {
        if (changedPurchase) {
          purchase.isFreezed = changedPurchase.isFreezed;


          // purchase.lastFreezeTs = currentTs;
          const currentTs = moment.now();
          const freezePromise = new Promise<Freeze>((resolve, reject) => {

            // in case if purchase just got frizzed - we should create new Freeze ;
            // otherwise we are found previously freezed item from server history
            if (changedPurchase.isFreezed) {
              resolve({id: 0, startDate: currentTs, purchaseId: changedPurchase.id});
            } else {
              const startTs = changedPurchase.lastFreezeTs;
              this.communicationService.findFreeze(purchase.id, startTs).toPromise().then(freeze => resolve(freeze));
            }
          });

          freezePromise.then((freeze) => {
            // if new freze  -we are updating purchase, otherwise we are updating freeze endDate
            if (freeze.id == 0) {
              purchase.lastFreezeTs = currentTs;
            } else {
              freeze.endDate = currentTs;
            }
            // updating freeze and updating purchase
            const updateFreezeMembershipPromise = this.communicationService.freezeMembership(freeze).toPromise();
            const updatePurchasePromise = this.communicationService.savePurchase(purchase).toPromise();
            Promise.all([updateFreezeMembershipPromise, updatePurchasePromise]).then(() => {
              this.purchasesSubj.next([...this.purchasesSubj.getValue()]);
            });
          });
        }

      }
    );
  }

}
