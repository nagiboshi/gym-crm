import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CommunicationService} from '@shared/communication.service';
import {PaymentMethod} from '../../../models/payment-method';
import {MatDialog} from '@angular/material/dialog';
import {PaymentMethodCreateDialogComponent} from './payment-method-create-dialog/payment-method-create-dialog.component';
import {DeletePromptDialogComponent} from '@shared/delete-prompt-dialog/delete-prompt-dialog.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'payment-methods-settings',
  templateUrl: './payment-methods-settings.component.html',
  styleUrls: ['./payment-methods-settings.component.scss']
})
export class PaymentMethodsSettingsComponent implements OnInit, AfterViewInit {
  displayColumns = ['name', 'edit', 'delete'];
  dataSource: MatTableDataSource<PaymentMethod>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private dialog: MatDialog, private communicationService: CommunicationService) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<PaymentMethod>(this.communicationService.getPaymentMethods());
  }


  _newPaymentMethod() {
    return {id: 0, name: ''};
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
