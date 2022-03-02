import {ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
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

export interface StockPurchaseFormData {
  stock?: InventoryItem;
  member?: Member;
}
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
  memberFormGroup: FormGroup;
  paymentMethods: PaymentMethod[];
  @Input()
  member: Member;
  @Output()
  stockPurchase: EventEmitter<StockPurchase> = new EventEmitter<StockPurchase>();
  joinFields: QueryJoin[] = [{field: 'product'}, {field: 'details'}];
  taxes: Tax[];
  constructor(private dialogRef: MatDialogRef<StockPurchaseFormComponent>,
              private paymentMethodService: PaymentMethodService,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar,
              private productPurchaseService: StockPurchaseService,
              private communication: CommunicationService,
              @Inject(MAT_DIALOG_DATA) public data: StockPurchaseFormData) {
  }

  ngOnInit(): void {
    this.taxes = this.communication.getTaxes();
    // this.selectedStock = new BehaviorSubject<InventoryItem>(this.stock);
    // this.selectedStock$ = this.selectedStock.asObservable();
    if( !this.data ) {
      this.data = {};
    }
    if( this.member ) {
        this.data['member'] = this.member;
     }

    this.paymentMethods = this.paymentMethodService.getPaymentMethods();
    this.memberFormGroup = this.fb.group({
      member: [this.data.member]
    });

    this.stockFormGroup = this.fb.group({
      stock: [this.data.stock, [Validators.required]],
    });
    this.priceFormGroup = this.fb.group({
      price: [this.data.stock?.price, [Validators.required, Validators.min(this.data.stock?.price), Validators.max(999999)]],
      discount: [0, [Validators.min(0), Validators.max(100)]]
    });
    this.quantityFormGroup = this.fb.group({
      quantity: [this.data.stock?.qty, [Validators.required, Validators.min(1), Validators.max(this.data.stock?.qty)]],
    });
    this.paymentMethodFormGroup = this.fb.group({
      paymentMethod: [first(this.paymentMethodService.getPaymentMethods()),Validators.required]
    });
  }

  submitPurchase() {
    const purchase: Partial<StockPurchase> = {};
    purchase.id = 0;
    purchase.itemId = this.stockFormGroup.value.stock.id;
    purchase.price = this.priceFormGroup.value.price;
    purchase.saleDate = Date.now();
    purchase.paymentMethodId = this.paymentMethodFormGroup.value.paymentMethod.id;
    purchase.qty = parseInt(this.quantityFormGroup.value.quantity);

    this.stockPurchase.emit(purchase as StockPurchase);
    this.dialogRef.close(purchase);
  }

  stockSelected(item: InventoryItem) {
    this.priceFormGroup.patchValue({price: item.price});
    this.stockFormGroup.patchValue({stock: item});
    this.quantityFormGroup.patchValue({qty: item.qty});
    // this.selectedStock.next(item);
  }

  memberSelected(member: Member) {
    this.memberFormGroup.patchValue({member: member});

  }
}
