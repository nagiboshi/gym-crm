import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {QueryJoin} from '@nestjsx/crud-request';
import {PaymentMethodService} from '../../../settings/settings-page/payment-methods-settings/payment-method.service';
import {first} from 'lodash';
import {PaymentMethod} from '@models/payment-method';
import {Tax} from '@models/tax';
import {CommunicationService} from '@shared/communication.service';
import {StockPurchase} from '@models/stock-purchase';
import {StockPurchaseService} from './stock-purchase.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {InventoryItem} from '../../invetory/inventory-list/inventory-item';
import {Member} from '@models/member';
import {Payment} from '@models/payment';


@Component({
  selector: 'stock-purchase-form',
  templateUrl: './stock-purchase-form.component.html',
  styleUrls: ['./stock-purchase-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockPurchaseFormComponent implements OnInit {
  priceFormGroup: FormGroup;
  quantityFormGroup: FormGroup;
  paymentMethodFormGroup: FormGroup;
  stockFormGroup: FormGroup;
  paymentFormGroup: FormGroup;
  memberFormGroup: FormGroup;
  noteFormGroup: FormGroup;
  paymentMethods: PaymentMethod[];
  stockQty: number;
  @Input()
  stock: InventoryItem;
  @Input()
  member: Member;
  @Output()
  stockPurchase: EventEmitter<StockPurchase> = new EventEmitter<StockPurchase>();
  joinFields: QueryJoin[] = [{field: 'product'}, {field: 'details'}];
  payments: Payment[] = [];
  taxes: Tax[];

  constructor(private paymentMethodService: PaymentMethodService,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar,
              private productPurchaseService: StockPurchaseService,
              private communication: CommunicationService) {
  }

  ngOnInit(): void {
    this.taxes = this.communication.getTaxes();

    this.paymentMethods = this.paymentMethodService.getPaymentMethods();
    this.memberFormGroup = this.fb.group({
      member: [this.member]
    });

    this.paymentFormGroup = this.fb.group({
      payments: [this.payments, [Validators.required]]
    });

    this.stockFormGroup = this.fb.group({
      stock: [this.stock, [Validators.required]],
    });
    this.priceFormGroup = this.fb.group({
      price: [this.stock?.price, [Validators.required, Validators.min(this.stock?.price), Validators.max(999999)]],
      discount: [0, [Validators.min(0), Validators.max(100)]]
    });
    this.quantityFormGroup = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(this.stock?.qty)]],
    });
    this.stockQty = this.stock?.qty ?? 1;
    this.paymentMethodFormGroup = this.fb.group({
      paymentMethod: [first(this.paymentMethodService.getPaymentMethods()), Validators.required]
    });
    this.noteFormGroup = this.fb.group({
      note: ['']
    });
  }

  submitPurchase() {
    const purchase: Partial<StockPurchase> = {};
    purchase.id = 0;
    purchase.itemId = this.stockFormGroup.value.stock.id;
    purchase.price = this.priceFormGroup.value.price;
    purchase.saleDate = Date.now();
    purchase.discount = this.priceFormGroup.value.discount;
    purchase.payments= this.paymentFormGroup.value.payments;
    purchase.qty = parseInt(this.quantityFormGroup.value.quantity);
    purchase.note = this.noteFormGroup.value.note;
    purchase.buyerId = this.memberFormGroup.value.member.id;
    this.stockPurchase.emit(purchase as StockPurchase);
  }

  stockSelected(item: InventoryItem) {
    this.priceFormGroup.patchValue({price: item.price});
    this.stockFormGroup.patchValue({stock: item});
    this.stockQty = item.qty;
  }

  patchPayments(payments: Payment[]) {
    this.paymentFormGroup.patchValue({'payments': payments});
  }

  memberSelected(member: Member) {
    this.memberFormGroup.patchValue({member: member});
  }
}
