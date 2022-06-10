import { Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {CommunicationService, UserRole} from '@shared/communication.service';
import {User} from '@models/user';
import {Tax} from '@models/tax';


@Component({
  selector: 'tax-merge-dialog',
  templateUrl: './tax-merge-dialog.component.html',
  styleUrls: ['./tax-merge-dialog.component.scss']
})
export class TaxMergeDialogComponent implements OnInit {
  title = 'Registering new tax';
  taxForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: Tax, private fb: FormBuilder, public communicationService: CommunicationService) {
  }

  ngOnInit(): void {
    this.taxForm = this.fb.group({
        id: [this.data.id],
        name: [this.data.name, [Validators.required]],
        value: [this.data.value, [Validators.required]],
      }

    );
  }


}
