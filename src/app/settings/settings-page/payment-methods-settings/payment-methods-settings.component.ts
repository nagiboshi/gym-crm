import { Component, OnInit } from '@angular/core';
import {CommunicationService} from '@shared/communication.service';
import {PaymentMethod} from '../../../models/payment-method';
import {MatDialog} from '@angular/material/dialog';
import {PaymentMethodDataSource} from './payment-method-data-source';
import {PaymentMethodCreateDialogComponent} from './payment-method-create-dialog/payment-method-create-dialog.component';
import {DeletePromptDialogComponent} from '@shared/delete-prompt-dialog/delete-prompt-dialog.component';

@Component({
  selector: 'payment-methods-settings',
  templateUrl: './payment-methods-settings.component.html',
  styleUrls: ['./payment-methods-settings.component.scss']
})
export class PaymentMethodsSettingsComponent implements OnInit {
  displayColumns = ['name', 'edit', 'delete'];
  dataSource: PaymentMethodDataSource;

  constructor(private dialog: MatDialog, private communicationService: CommunicationService) {
  }

  ngOnInit(): void {
    this.dataSource = new PaymentMethodDataSource(this.communicationService);
  }


  _newPaymentMethod() {
    return {id: 0, name: ''};
  }

  remove(paymentMethodToRemove: PaymentMethod) {
    this.dialog.open(DeletePromptDialogComponent, {data: `Are you sure you want to delete class ${paymentMethodToRemove.name}`}).afterClosed().subscribe((doAction) => {
      if (doAction) {
        this.communicationService.removePaymentMethod(paymentMethodToRemove.id);
      }
    });

  }

  showPaymentMethodDialog(paymentMethod?: PaymentMethod) {
    paymentMethod = paymentMethod ?? this._newPaymentMethod();
    this.dialog.open(PaymentMethodCreateDialogComponent, {data: paymentMethod}).afterClosed().subscribe((paymentMethodToCreate) => {
      if (paymentMethodToCreate) {
        this.communicationService
          .addPaymentMethod(paymentMethodToCreate);
      }
    });
  }
}
