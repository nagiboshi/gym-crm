import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PaymentMethod} from '../../../../models/payment-method';
import {CommunicationService} from '@shared/communication.service';

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
