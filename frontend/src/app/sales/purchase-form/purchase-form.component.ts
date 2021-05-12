import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'lodash';
import {Package} from '../../models/package';
import {PackageItem} from '../../models/package-item';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {CommunicationService} from '@shared/communication.service';
import * as _moment from 'moment';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PaymentMethod} from '../../models/payment-method';
const moment = _moment;

@Component({
  selector: 'app-purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PurchaseFormComponent implements OnInit {

  serviceFormGroup: FormGroup;
  serviceItemFormGroup: FormGroup;
  selectPaymentFormGroup: FormGroup;
  startDateFormGroup: FormGroup;
  salePriceFormGroup: FormGroup;
  noteFormGroup: FormGroup;
  selectedService: Package;
  membershipServices: Package[];
  selectedServiceItem: PackageItem;
  serviceItems$: Observable<PackageItem[]>;
  paymentMethods: PaymentMethod[];

  constructor(private dialogRef: MatDialogRef<PurchaseFormComponent>,
              private fb: FormBuilder,
              public communicationService: CommunicationService,
              @Inject(MAT_DIALOG_DATA) private memberId: number) {
  }

  ngOnInit(): void {

    this.membershipServices = this.communicationService.getPackages();
    this.paymentMethods = this.communicationService.getPaymentMethods();
    this.selectedService = first(this.membershipServices);
    this.selectedServiceItem = first(this.selectedService.items);
    this.serviceItems$ = of(this.selectedService.items);
    // service selection step form
    this.serviceFormGroup = this.fb.group({
        service: [this.selectedService, Validators.required]
      }
    );

    // service item selection step form
    this.serviceItemFormGroup = this.fb.group({
      serviceItem: [this.selectedServiceItem, Validators.required]
    });

    this.selectPaymentFormGroup = this.fb.group({
      paymentMethod: [first(this.paymentMethods), Validators.required]
    });

    this.salePriceFormGroup = this.fb.group({
      price: [0, Validators.required]
    });

    this.noteFormGroup = this.fb.group({
      note: ['']
    });

    this.startDateFormGroup = this.fb.group({
      startDate: [moment(), Validators.required]
    });
  }

  afterServiceFormGroupSelection(membershipService: Package) {
    this.selectedService = membershipService;
    this.serviceItems$ = of(this.selectedService.items);
  }

  getSubtotal() {
    return this.salePriceFormGroup.value.price;
  }

  getTax() {
    return Math.round(parseFloat(this.salePriceFormGroup.value.price) * environment.vat);
  }

  afterServiceItemFormGroupSelection(membershipItem: PackageItem) {
    this.selectedServiceItem = membershipItem;
  }

  submitPurchase(): void {
    const startDateMoment = this.startDateFormGroup.value.startDate;
    const note = this.noteFormGroup.value.note;

    this.dialogRef.close({
      id: 0,
      price: this.salePriceFormGroup.value.price,
      memberId: this.memberId,
      note,
      isFreezed: false,
      saleDate: moment.now(),
      startDate: startDateMoment.toDate().getTime(),
      paymentMethodId: this.selectPaymentFormGroup.value.paymentMethod.id,
      item: this.selectedServiceItem,
    });
  }

}
