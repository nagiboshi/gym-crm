import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Payment} from '@models/payment';
import {MembershipPurchaseModel} from '@models/membership-purchase';
import {clone} from 'lodash';
import {TaxService} from '@shared/tax.service';
import {Tax} from '@models/tax';
export type PaymentsChanges = {
  newPayments: Payment[],
  removedPayments: Payment[]
}
@Component({
  selector: 'payment-finalization-dialog',
  templateUrl: './payment-finalization-dialog.component.html',
  styleUrls: ['./payment-finalization-dialog.component.scss']
})
export class PaymentFinalizationDialogComponent implements OnInit{
  payments: Payment[];
  paymentsToRemove: Payment[] = [];
  membershipPurchaseModel: MembershipPurchaseModel;
  taxes: Tax[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: MembershipPurchaseModel, public taxService: TaxService) {

  }

  paymentsUpdate(payments: Payment[]) {
      this.payments = payments;
  }

  paymentRemoved(paymentToRemove: Payment) {
    if( paymentToRemove.id != 0 ) {
      this.paymentsToRemove.push(paymentToRemove);
    }
  }

  ngOnInit(): void {
    this.taxes = this.taxService.getTaxes();
    this.membershipPurchaseModel = clone(this.data);
  }
}
