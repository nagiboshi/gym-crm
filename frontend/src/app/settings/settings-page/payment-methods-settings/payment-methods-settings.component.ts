import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CommunicationService} from '@shared/communication.service';
import {PaymentMethod} from '../../../models/payment-method';
import {MatDialog} from '@angular/material/dialog';
import {PaymentMethodCreateDialogComponent} from './payment-method-create-dialog/payment-method-create-dialog.component';
import {DeletePromptDialogComponent} from '@shared/delete-prompt-dialog/delete-prompt-dialog.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {PaymentMethodService} from './payment-method.service';

@Component({
  selector: 'payment-methods-settings',
  templateUrl: './payment-methods-settings.component.html',
  styleUrls: ['./payment-methods-settings.component.scss']
})
export class PaymentMethodsSettingsComponent implements OnInit, AfterViewInit {
  displayColumns = ['name', 'edit', 'delete'];
  dataSource: MatTableDataSource<PaymentMethod>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private dialog: MatDialog, private paymentService: PaymentMethodService) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<PaymentMethod>();
    this.paymentService.paymentMethods$.subscribe(paymentMethods => this.dataSource.data = paymentMethods);
    // this.paymentService.getPaymentMethods();
  }

  // ngAfterViewInit() {
  // }


  _newPaymentMethod() {
    return {id: 0, name: ''};
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  remove(paymentMethodToRemove: PaymentMethod) {
    this.dialog.open(DeletePromptDialogComponent, {data: `Are you sure you want to delete class ${paymentMethodToRemove.name}`}).afterClosed().subscribe((doAction) => {
      if (doAction) {
        this.paymentService.removePaymentMethod(paymentMethodToRemove.id);
      }
    });

  }

  showPaymentMethodDialog(paymentMethod?: PaymentMethod) {
    paymentMethod = paymentMethod ?? this._newPaymentMethod();
    this.dialog.open(PaymentMethodCreateDialogComponent, {data: paymentMethod}).afterClosed().subscribe((paymentMethodToCreate) => {
      if (paymentMethodToCreate) {
        this.paymentService
          .addPaymentMethod(paymentMethodToCreate);
      }
    });
  }

  removePaymentMethod(paymentMethodToRemove: PaymentMethod) {
      this.dialog.open(DeletePromptDialogComponent, {data: `Are you sure you want to remove ${paymentMethodToRemove.name} ?`}).afterClosed().subscribe(() => {
          this.paymentService.removePaymentMethod(paymentMethodToRemove.id);
      });
  }
}
