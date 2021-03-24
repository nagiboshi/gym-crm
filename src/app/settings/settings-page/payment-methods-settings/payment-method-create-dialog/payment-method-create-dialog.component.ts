import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ClassCategory} from '../../../../classes/class.category';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {first} from 'lodash';
import {ClassModel} from '../../../../classes/class.model';
import {PaymentMethod} from '../../../../models/payment-method';
import {ClassDialogData, CreateClassDialogComponent} from '../../classes/create-class-dialog/create-class-dialog.component';
import {CommunicationService} from '../../../../shared/communication.service';

@Component({
  selector: 'payment-method-create-class-dialog',
  templateUrl: './payment-method-create-dialog.component.html',
  styleUrls: ['./payment-method-create-dialog.component.scss']
})
export class PaymentMethodCreateDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private communicationService: CommunicationService,
              private dialogRef: MatDialogRef<PaymentMethodCreateDialogComponent>,
              private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: PaymentMethod) {
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      id: [this.data.id],
      name: [this.data.name, [Validators.required]]
    });
  }


  merge() {
    this.dialogRef.close(this.formGroup.value);
  }


}
