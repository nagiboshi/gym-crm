import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ExtendedMembershipPurchaseModel} from '@models/membership-purchase';
import {Member} from '@models/member';
import {Router} from '@angular/router';
import {SharePurchaseDialogComponent} from '@shared/share-purchase-dialog/share-purchase-dialog.component';
import {clone, cloneDeep, isEmpty, remove} from 'lodash';
import {FreezeMembershipDialogComponent} from '@shared/freeze-membership-dialog/freeze-membership-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {SalesService} from '../../../sales/sales.service';
import * as moment from 'moment';
import {Moment} from 'moment';
import {HelpersService} from '@shared/helpers.service';
import {
  PaymentFinalizationDialogComponent,
  PaymentsChanges
} from '../../../sales/payment-finalization-dialog/payment-finalization-dialog.component';
import {MembersService} from '../../members.service';
import {Payment} from '@models/payment';
import {BehaviorSubject, Observable} from 'rxjs';
import {TaxService} from '@shared/tax.service';
import {Tax} from '@models/tax';

@Component({
  selector: 'membership-status',
  templateUrl: './membership-status.component.html',
  styleUrls: ['./membership-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MembershipStatusComponent implements OnInit {
  @Input()
  member: Member;
  paymentsSubj: BehaviorSubject<Payment[]>;
  payments$: Observable<Payment[]>;
  @Output()
  membershipUpdated: EventEmitter<ExtendedMembershipPurchaseModel> = new EventEmitter<ExtendedMembershipPurchaseModel>();
  @Input()
  activeMembership: ExtendedMembershipPurchaseModel;
  todayMoment: Moment = moment();
  taxes: Tax[];

  constructor(private router: Router,
              private membersService: MembersService,
              private dialog: MatDialog,
              private taxService: TaxService,
              private helpers: HelpersService,
              private salesService: SalesService) {
  }

  ngOnChanges(changes) {
    if( changes.activeMembership && !changes.activeMembership.firstChange) {
      this.paymentsSubj.next([...changes.activeMembership?.currentValue.payments]);
    }
  }

  ngOnInit(): void {
    this.paymentsSubj = new BehaviorSubject(this.activeMembership.payments?[...this.activeMembership.payments]:[]);
    this.payments$ = this.paymentsSubj.asObservable();
    this.taxes = this.taxService.getTaxes();
  }

  sharePurchase(purchaseHistoryItem: ExtendedMembershipPurchaseModel) {
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

  freezePurchase(purchase: ExtendedMembershipPurchaseModel) {
    this.dialog.open(FreezeMembershipDialogComponent, {data: purchase}).afterClosed().subscribe((changedPurchase: ExtendedMembershipPurchaseModel) => {
        if (changedPurchase) {
          this.salesService.savePurchase(this.salesService.toPurchaseItemModel(changedPurchase)).toPromise().then((purchaseItemModel) => {
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

  openFinalizationPaymentDialog() {
    this.dialog.open(PaymentFinalizationDialogComponent, {data: cloneDeep(this.activeMembership)}).afterClosed().subscribe((paymentsChanges: PaymentsChanges) => {
      if (paymentsChanges) {

        if( !isEmpty(paymentsChanges.removedPayments) ) {
          this.salesService.deletePayments(paymentsChanges.removedPayments);
          paymentsChanges.removedPayments.forEach( (p) => remove(this.activeMembership.payments, paymentToRemove => paymentToRemove.id == p.id));
          this.paymentsSubj.next(this.activeMembership.payments);
        }

        if ( !isEmpty(paymentsChanges.newPayments)) {
          this.salesService.createPayments(paymentsChanges.newPayments).then((newPayments) => {
            this.activeMembership.payments = newPayments;
            this.activeMembership = this.helpers.extendMembership(cloneDeep(this.activeMembership));
            this.paymentsSubj.next(this.activeMembership.payments);
          });
        }
      }
    });
  }
}
