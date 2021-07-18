import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first, isEmpty} from 'lodash';
import {MembershipGroup} from '@models/membership-group';
import {Membership} from '@models/membership';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {CommunicationService} from '@shared/communication.service';
import * as _moment from 'moment';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PaymentMethod} from '@models/payment-method';
import {PaymentMethodService} from '../../settings/settings-page/payment-methods-settings/payment-method.service';
import {MembershipGroupService} from '@shared/membership-group.service';
import {Member} from '@models/member';
const moment = _moment;

@Component({
  selector: 'app-purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PurchaseFormComponent implements OnInit {

  membershipGroupFormGroup: FormGroup;
  membershipFormGroup: FormGroup;
  selectPaymentFormGroup: FormGroup;
  startDateFormGroup: FormGroup;
  salePriceFormGroup: FormGroup;
  noteFormGroup: FormGroup;
  selectedMembershipGroup: MembershipGroup;
  allMembershipGroups: MembershipGroup[];
  selectedMembership: Membership;
  memberships$: Observable<Membership[]>;
  paymentMethods: PaymentMethod[];

  constructor(private dialogRef: MatDialogRef<PurchaseFormComponent>,
              private fb: FormBuilder,
              public paymentService: PaymentMethodService,
              public membershipGroupService: MembershipGroupService,
              public communicationService: CommunicationService,
              @Inject(MAT_DIALOG_DATA) private member: Member) {
  }

  ngOnInit(): void {

    this.allMembershipGroups = this.membershipGroupService.getMembershipGroups();
    this.paymentMethods = this.paymentService.getPaymentMethods();
    if ( isEmpty(this.allMembershipGroups)) {
        this.dialogRef.close();
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

  afterServiceFormGroupSelection(membershipService: MembershipGroup) {
    this.selectedMembershipGroup = membershipService;
    this.memberships$ = of(this.selectedMembershipGroup.memberships);
  }

  getSubtotal() {
    return this.salePriceFormGroup.value.price;
  }

  getTax() {
    return Math.round(parseFloat(this.salePriceFormGroup.value.price) * environment.vat);
  }

  afterMembershipFormGroupSelection(membership: Membership) {
    this.selectedMembership = membership;
  }

  submitPurchase(): void {
    const startDateMoment = this.startDateFormGroup.value.startDate;
    const note = this.noteFormGroup.value.note;

    this.dialogRef.close({
      id: 0,
      price: this.salePriceFormGroup.value.price,
      members: [this.member],
      note,
      // isFreezed: false,
      saleDate: moment.now(),
      startDate: startDateMoment.toDate().getTime(),
      paymentMethodId: this.selectPaymentFormGroup.value.paymentMethod.id,
      membershipId: this.selectedMembership.id,
    });

  }
}
