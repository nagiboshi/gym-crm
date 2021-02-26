import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PurchaseItem} from '../../models/purchase.model';
import {FreezeMembershipDialogComponent} from '../freeze-membership-dialog/freeze-membership-dialog.component';
import {Freeze} from '../../models/freeze.model';
import {CommunicationService} from '../communication.service';
import {MatDialog} from '@angular/material/dialog';
import {PurchaseFormComponent} from '../../sales/purchase-form/purchase-form.component';
import {BehaviorSubject} from 'rxjs';
import * as _moment from 'moment';

const moment = _moment;

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PurchaseHistoryComponent implements OnInit {
  purchasesSubj: BehaviorSubject<PurchaseItem[]> = new BehaviorSubject(null);

  @Input()
  memberId: number;

  ngOnInit(): void {
    this.communicationService.getMemberPurchases(this.memberId)
      .toPromise()
      .then(purchaseItems => this.purchasesSubj.next(purchaseItems));
  }

  addNewPurchase() {
    this.dialog.open(PurchaseFormComponent, {data: this.memberId}).afterClosed().subscribe((purchase: PurchaseItem) => {
      const savedPurchaseItem = this.communicationService.savePurchase(purchase);
      savedPurchaseItem.toPromise().then((purchaseItem) => {
        this.purchasesSubj.next([purchaseItem, ...this.purchasesSubj.getValue()]);
      });
    });
  }


  constructor(public dialog: MatDialog, private communicationService: CommunicationService) { }

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
