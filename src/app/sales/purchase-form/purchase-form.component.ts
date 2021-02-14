import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'lodash';
import {MembershipService} from '../../models/membership-service.model';
import {StepperSelectionEvent} from '@angular/cdk/stepper';
import {MembershipItem} from '../../models/membership-item.model';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {PurchaseItem} from '../../models/purchase.model';
import {CommunicationService} from '../../shared/communication.service';

@Component({
  selector: 'app-purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss']
})
export class PurchaseFormComponent implements OnInit {
  serviceFormGroup: FormGroup;
  serviceItemFormGroup: FormGroup;
  quantityFormGroup: FormGroup;
  selectPaymentFormGroup: FormGroup;
  selectedService: MembershipService;
  membershipServices: MembershipService[];
  selectedServiceItem: MembershipItem;
  serviceItems$: Observable<MembershipItem[]>;
  paymentMethods = ['Cash', 'Cheque', 'Amex', 'Visa/MC', 'Discover', 'Credit (ATM) (No Auth)', 'Other', 'Account', 'Groupon Voucher', 'Prepaid Gift Card'];
  constructor(private fb: FormBuilder, public memberService: CommunicationService) {
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

    this.quantityFormGroup = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]]
    });

    // service item selection step form
    this.serviceItemFormGroup = this.fb.group({
      serviceItem: [this.selectedServiceItem, Validators.required]
    });

    this.selectPaymentFormGroup = this.fb.group({
          paymentMethod: ['', Validators.required]
        });
  }

  afterServiceFormGroupSelection(membershipService: MembershipService ) {
    this.selectedService = membershipService;
    this.serviceItems$ = of(this.selectedService.items);
  }

  getSubtotal() {
    const quantity = this.quantityFormGroup.value.quantity;
    const selectedItemPrice = this.selectedServiceItem.price;
    return quantity * selectedItemPrice;
  }

  getTax() {
    return Math.round( this.getSubtotal() * environment.vat);
  }

  afterServiceItemFormGroupSelection(membershipItem: MembershipItem) {
    this.selectedServiceItem = membershipItem;
  }

  submitPurchase(): PurchaseItem {
    return {id: 0, memberId: 0, item: this.selectedServiceItem, qty: this.quantityFormGroup.value.quantity, discountId: 0};
  }
}
