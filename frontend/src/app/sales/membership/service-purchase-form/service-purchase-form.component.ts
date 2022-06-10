import {ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first, isEmpty} from 'lodash';
import {MembershipGroup} from '@models/membership-group';
import {Membership} from '@models/membership';
import {Observable, of} from 'rxjs';
import {CommunicationService} from '@shared/communication.service';
import * as _moment from 'moment';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MembershipGroupService} from '@shared/membership-group.service';
import {Member} from '@models/member';
import {PaymentMethodService} from '../../../settings/settings-page/payment-methods-settings/payment-method.service';
import {MembershipPurchaseModel} from '@models/membership-purchase';
import {Payment} from '@models/payment';
import {TaxService} from '@shared/tax.service';
import {Tax} from '@models/tax';
import {DiscountPipe} from '@shared/pipes/discount.pipe';

const moment = _moment;


@Component({
  selector: 'service-purchase-form',
  templateUrl: './service-purchase-form.component.html',
  styleUrls: ['./service-purchase-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicePurchaseFormComponent implements OnInit {
  @Input()
  predefinedMember: Member;
  @Output()
  servicePurchase: EventEmitter<any> = new EventEmitter<any>();
  membershipGroupFormGroup: FormGroup;
  membershipFormGroup: FormGroup;
  selectPaymentFormGroup: FormGroup;
  startDateFormGroup: FormGroup;
  salePriceFormGroup: FormGroup;
  paymentFormGroup: FormGroup;
  noteFormGroup: FormGroup;
  selectedMembershipGroup: MembershipGroup;
  allMembershipGroups: MembershipGroup[];
  selectedMembership: Membership;
  memberships$: Observable<Membership[]>;
  payments: Payment[] = [];
  taxes: Tax[];

  constructor(private fb: FormBuilder,
              public paymentService: PaymentMethodService,
              public taxService: TaxService,
              public discoutPipe: DiscountPipe,
              public membershipGroupService: MembershipGroupService,
              public communicationService: CommunicationService,
              @Inject(MAT_DIALOG_DATA) private member: Member) {
  }

  ngOnInit(): void {
    this.taxes = this.taxService.getTaxes();
    this.allMembershipGroups = this.membershipGroupService.getMembershipGroups('shared');
    if (isEmpty(this.allMembershipGroups)) {
      throw Error('Memberships not created yet! Please configure memberships first');
    }
    this.selectedMembershipGroup = first(this.allMembershipGroups);
    this.selectedMembership = first(this.selectedMembershipGroup.memberships);
    this.memberships$ = of(this.selectedMembershipGroup.memberships);
    // service selection step form
    this.membershipGroupFormGroup = this.fb.group({
        membershipGroup: [this.selectedMembershipGroup, Validators.required]
      }
    );

    // service item selection step form
    this.membershipFormGroup = this.fb.group({
      membership: [this.selectedMembership, Validators.required]
    });

    this.paymentFormGroup = this.fb.group({
      payments: [this.payments, [Validators.required]]
    });

    this.salePriceFormGroup = this.fb.group({
      price: [0, [Validators.required, Validators.min(0), Validators.max(999999999)]],
      discount: [0, [Validators.required, Validators.min(0)]]
    });

    this.noteFormGroup = this.fb.group({
      note: ['', Validators.maxLength(500)]
    });

    this.startDateFormGroup = this.fb.group({
      startDate: [moment(), Validators.required]
    });
  }

  afterServiceFormGroupSelection(membershipService: MembershipGroup) {
    this.selectedMembershipGroup = membershipService;
    this.memberships$ = of(this.selectedMembershipGroup.memberships);
  }

  getSubtotal() {
    return this.salePriceFormGroup.value.price;
  }

  getTax(tax: Tax) {
    const price = this.salePriceFormGroup.value.price;
    const discount = this.salePriceFormGroup.value.discount;
    return this.discoutPipe.transform(price, discount)  * tax.value/100;
  }

  afterMembershipFormGroupSelection(membership: Membership) {
    this.selectedMembership = membership;
  }

  submitPurchase(): void {
    const startDateMoment = this.startDateFormGroup.value.startDate;
    const note = this.noteFormGroup.value.note;
    const servicePurchase: Partial<MembershipPurchaseModel> = {
      id: 0,
      price: this.salePriceFormGroup.value.price,
      members: [this.predefinedMember ? this.predefinedMember : this.member],
      buyerId: this.predefinedMember ? this.predefinedMember.id : this.member.id,
      note,
      freezeId: null,
      discount: this.salePriceFormGroup.value.discount,
      startDate: startDateMoment.toDate(),
      payments: this.paymentFormGroup.value.payments,
      membershipId: this.selectedMembership.id,
    };
    this.servicePurchase.emit(servicePurchase);
  }

  patchPayments(payments: Payment[]) {
    this.paymentFormGroup.patchValue({'payments': payments});
  }
}
