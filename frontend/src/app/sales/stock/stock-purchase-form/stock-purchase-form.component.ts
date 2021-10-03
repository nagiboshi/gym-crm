import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Stock} from '@models/stock';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {QueryJoin} from '@nestjsx/crud-request';
import {PaymentMethodService} from '../../../settings/settings-page/payment-methods-settings/payment-method.service';
import {first} from 'lodash';
import {PaymentMethod} from '@models/payment-method';
import {Tax} from '@models/tax';
import {CommunicationService} from '@shared/communication.service';
import {StockPurchase} from '@models/stock-purchase';
@Component({
  selector: 'stock-purchase-form',
  templateUrl: './stock-purchase-form.component.html',
  styleUrls: ['./stock-purchase-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockPurchaseFormComponent implements OnInit {
  stockFormGroup: FormGroup;
  selectedStock: BehaviorSubject<Stock>;
  selectedStock$: Observable<Stock>;
  priceFormGroup: FormGroup;
  quantityFormGroup: FormGroup;
  stockPropertiesControllers: FormGroup[];
  paymentMethodFormGroup: FormGroup;
  paymentMethods: PaymentMethod[];
  joinFields: QueryJoin[] = [{field: 'properties'}, {field: 'properties.values'}];
  taxes: Tax[];
  stockSub: Subscription;
  constructor(private dialogRef: MatDialogRef<StockPurchaseFormComponent>,
              private paymentMethodService: PaymentMethodService,
              private fb: FormBuilder,
              private communication: CommunicationService,
              @Inject(MAT_DIALOG_DATA) public stock) {
  }

  ngOnDestroy() {
    this.stockSub.unsubscribe();
  }

  ngOnInit(): void {
    this.taxes = this.communication.getTaxes();
    this.selectedStock = new BehaviorSubject<Stock>(this.stock);
    this.selectedStock$ = this.selectedStock.asObservable();
    this.stockSub = this.selectedStock$.subscribe((stock)=> {
      this.stockPropertiesControllers = [];
      stock.details.forEach(property => {
        this.stockPropertiesControllers.push(this.fb.group({
          property: [property],
          propertyValue: [null, Validators.required]
        }));
      });
    })
    this.paymentMethods = this.paymentMethodService.getPaymentMethods();
    this.stockFormGroup = this.fb.group({
      stock: [this.stock, [Validators.required]],
    });
    this.priceFormGroup = this.fb.group({
      price: [this.stock?.price, [Validators.required, Validators.min(0), Validators.max(999999)]],
      discount: [0, [Validators.min(0), Validators.max(100)]]
    });
    this.quantityFormGroup = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(0), Validators.max(9999)]],
    });
    this.paymentMethodFormGroup = this.fb.group({
      paymentMethod: [first(this.paymentMethodService.getPaymentMethods()),Validators.required]
    });
  }


  stockSelected(stock: Stock) {
    this.stockFormGroup.patchValue({stock: stock});
    this.selectedStock.next(stock);
  }

  submitPurchase() {
    const purchase: Partial<StockPurchase> = {};
    purchase.id = 0;
    purchase.stockId = this.stockFormGroup.value.stock.id;
    purchase.price = this.priceFormGroup.value.price;
    purchase.saleDate = Date.now();
    purchase.properties = [];
    purchase.paymentMethodId = this.paymentMethodFormGroup.value.paymentMethod.id;
    this.stockPropertiesControllers.forEach((fg: FormGroup) => {
        purchase.properties.push(fg.value.propertyValue);
    });
    purchase.quantity = parseInt(this.quantityFormGroup.value.quantity);
    // purchase.
    // console.log(purchase);
    this.dialogRef.close(purchase);
  }
}
