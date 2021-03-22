import { Component, OnInit } from '@angular/core';
import {CommunicationService} from '../../../shared/communication.service';
import {PaymentMethod} from '../../../models/payment-method';

@Component({
  selector: 'payment-methods-settings',
  templateUrl: './payment-methods-settings.component.html',
  styleUrls: ['./payment-methods-settings.component.scss']
})
export class PaymentMethodsSettingsComponent implements OnInit {
  displayColumns = ['name', 'edit', 'delete'];
  paymentMethods: PaymentMethod[];
  constructor(private communicationService: CommunicationService) { }

  ngOnInit(): void {
    this.paymentMethods = this.communicationService.getPaymentMethods();
  }
}
