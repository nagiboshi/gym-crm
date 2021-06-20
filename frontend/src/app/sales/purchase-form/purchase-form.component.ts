import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'lodash';
import {ProductCategory} from '@models/product-category';
import {Product} from '@models/product';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {CommunicationService} from '@shared/communication.service';
import * as _moment from 'moment';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PaymentMethod} from '@models/payment-method';
import {PaymentMethodService} from '../../settings/settings-page/payment-methods-settings/payment-method.service';
import {ProductCategoriesService} from '@shared/product-categories.service';
import {Member} from '@models/member';
const moment = _moment;

@Component({
  selector: 'app-purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PurchaseFormComponent implements OnInit {

  productCategoryFormGroup: FormGroup;
  productFormGroup: FormGroup;
  selectPaymentFormGroup: FormGroup;
  startDateFormGroup: FormGroup;
  salePriceFormGroup: FormGroup;
  noteFormGroup: FormGroup;
  selectedProductCategory: ProductCategory;
  allProductCategories: ProductCategory[];
  selectedProduct: Product;
  products$: Observable<Product[]>;
  paymentMethods: PaymentMethod[];

  constructor(private dialogRef: MatDialogRef<PurchaseFormComponent>,
              private fb: FormBuilder,
              public paymentService: PaymentMethodService,
              public productCategoriesService: ProductCategoriesService,
              public communicationService: CommunicationService,
              @Inject(MAT_DIALOG_DATA) private member: Member) {
  }

  ngOnInit(): void {

    this.allProductCategories = this.productCategoriesService.getProductCategories();
    this.paymentMethods = this.paymentService.getPaymentMethods();
    this.selectedProductCategory = first(this.allProductCategories);
    this.selectedProduct = first(this.selectedProductCategory.products);
    this.products$ = of(this.selectedProductCategory.products);
    // service selection step form
    this.productCategoryFormGroup = this.fb.group({
        productCategory: [this.selectedProductCategory, Validators.required]
      }
    );

    // service item selection step form
    this.productFormGroup = this.fb.group({
      product: [this.selectedProduct, Validators.required]
    });

    this.selectPaymentFormGroup = this.fb.group({
      paymentMethod: [first(this.paymentMethods), Validators.required]
    });

    this.salePriceFormGroup = this.fb.group({
      price: [0, [Validators.required, Validators.min(0), Validators.max(999999999)]]
    });

    this.noteFormGroup = this.fb.group({
      note: ['', Validators.maxLength(500)]
    });

    this.startDateFormGroup = this.fb.group({
      startDate: [moment(), Validators.required]
    });
  }

  afterServiceFormGroupSelection(membershipService: ProductCategory) {
    this.selectedProductCategory = membershipService;
    this.products$ = of(this.selectedProductCategory.products);
  }

  getSubtotal() {
    return this.salePriceFormGroup.value.price;
  }

  getTax() {
    return Math.round(parseFloat(this.salePriceFormGroup.value.price) * environment.vat);
  }

  afterProductFormGroupSelection(product: Product) {
    this.selectedProduct = product;
  }

  submitPurchase(): void {
    const startDateMoment = this.startDateFormGroup.value.startDate;
    const note = this.noteFormGroup.value.note;

    this.dialogRef.close({
      id: 0,
      price: this.salePriceFormGroup.value.price,
      members: [this.member],
      // memberId: this.memberId,
      note,
      // isFreezed: false,
      saleDate: moment.now(),
      startDate: startDateMoment.toDate().getTime(),
      paymentMethodId: this.selectPaymentFormGroup.value.paymentMethod.id,
      productId: this.selectedProduct.id,
    });

  }
}
