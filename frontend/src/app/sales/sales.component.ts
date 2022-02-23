import { Component, OnInit } from '@angular/core';
import {PaymentMethodService} from '../settings/settings-page/payment-methods-settings/payment-method.service';
import {MembershipGroupService} from '@shared/membership-group.service';

@Component({
  selector: 'sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {

  constructor(private paymentMethodService: PaymentMethodService, private membershipService: MembershipGroupService) { }

  ngOnInit(): void {
    this.paymentMethodService.fetchPaymentMethods().subscribe();
    this.membershipService.fetchMembershipGroups().subscribe();
  }

}
