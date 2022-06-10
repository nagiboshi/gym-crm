import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Payment} from '@models/payment';
import {PaymentMethodService} from '../../settings/settings-page/payment-methods-settings/payment-method.service';
import {PaymentMethod} from '@models/payment-method';
import {first} from 'lodash';
@Component({
  selector: 'payments',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @Input()
  styleWidth;
  @Input()
  payments: Partial<Payment[]>;
  @Input()
  stockPurchaseId: number;
  @Input()
  membershipPurchaseId: number;
  @Input()
  totalToPay: number;
  @Output()
  paymentsChanged: EventEmitter<Payment[]> = new EventEmitter<Payment[]>();
  @Output()
  paymentRemoved: EventEmitter<Payment> = new EventEmitter<Payment>();
  paymentMethods: PaymentMethod[];
  totalAmount: number = 0;

  constructor(private paymentService: PaymentMethodService) {
  }

  private _newPayment(): Payment {
    return {
      id: 0,
      paymentMethodId: null,
      amount: 0,
      date: new Date(),
      membershipPurchaseId: this.membershipPurchaseId,
      stockPurchaseId: this.stockPurchaseId
    };
  }

  ngOnInit(): void {
    this.paymentMethods = this.paymentService.getPaymentMethods();
    if (this.payments.length == 0) {
      this.payments.push(this._newPayment());
    }

    this.revalidatePaidAmount();
  }

  paymentChanged() {
    this.revalidatePaidAmount();
    this.paymentsChanged.next(this.payments);
  }

  addPayment() {
    this.payments.push(this._newPayment());
  }

  revalidatePaidAmount() {
    if (this.payments.length == 0) {
      this.totalAmount = 0;
      return;
    }

    this.totalAmount = this.payments.map(p => p.amount).reduce((prev, current, currentIndex) => {
      let val;
      if (!prev) {
        val = 0;
      } else {
        val = prev;
      }
      return val + current;
    });
  }

  removePayment(index: number) {
    const removedPayment = first(this.payments.splice(index, 1));
    this.revalidatePaidAmount();
    this.paymentRemoved.next(removedPayment);
  }
}
