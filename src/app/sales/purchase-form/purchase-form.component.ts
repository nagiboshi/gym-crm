import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'lodash';
import {MembershipService} from '../../models/membership-service.model';
import {MembershipItem} from '../../models/membership-item.model';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {PurchaseItem} from '../../models/purchase.model';
import {CommunicationService} from '../../shared/communication.service';
import * as _moment from 'moment';
import {Moment} from 'moment';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Member} from '../../models/member.model';

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
  selectedService: MembershipService;
  membershipServices: MembershipService[];
  selectedServiceItem: MembershipItem;
  serviceItems$: Observable<MembershipItem[]>;
  paymentMethods = ['Cash', 'Cheque', 'Amex', 'Visa/MC', 'Discover', 'Credit (ATM) (No Auth)', 'Other', 'Account', 'Groupon Voucher', 'Prepaid Gift Card'];

  constructor(private dialogRef: MatDialogRef<PurchaseFormComponent>,
              private fb: FormBuilder,
              public memberService: CommunicationService,
              @Inject(MAT_DIALOG_DATA) private memberId: number) {
  }

  ngOnInit(): void {

    this.membershipServices = this.memberService.getMembershipServices();
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
      paymentMethod: ['', Validators.required]
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

  afterServiceFormGroupSelection(membershipService: MembershipService) {
    this.selectedService = membershipService;
    this.serviceItems$ = of(this.selectedService.items);
  }

  getSubtotal() {
    return this.salePriceFormGroup.value.price;
  }

  getTax() {
    return Math.round(parseFloat(this.salePriceFormGroup.value.price) * environment.vat);
  }

  afterServiceItemFormGroupSelection(membershipItem: MembershipItem) {
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
      item: this.selectedServiceItem,
    });
  }

}
