import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {Package} from '../../../../models/package';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DeletePromptDialogComponent} from '@shared/delete-prompt-dialog/delete-prompt-dialog.component';

@Component({
  selector: 'app-sales-dialog',
  templateUrl: './sales-dialog.component.html',
  styleUrls: ['./sales-dialog.component.scss']
})
export class SalesDialogComponent implements OnInit {
  formGroup: FormGroup;
  packageItemsArray: FormArray;

  constructor(@Inject(MAT_DIALOG_DATA) public packageEl: Package, fb: FormBuilder, private dialog: MatDialog) {

    this.packageItemsArray = new FormArray([]);

    packageEl.items.forEach((item) => {
      this.packageItemsArray.push(
        fb.group({
          id: [item.id],
          name: [item.name, [Validators.required]],
          isShared: [item.isShared, Validators.required],
          numberOfParticipants  : [item.numberOfParticipants ?? 1, [Validators.required]],
          expirationType: [item.expirationType, Validators.required],
          expirationLength: [item.expirationLength, Validators.required],
        })

      );
    });

    this.formGroup = fb.group({
      name: [this.packageEl.name, Validators.required],
      items: this.packageItemsArray
    });
  }


  submit() {
      console.log('submitim bla > > > > ', this.formGroup.value);
  }

  ngOnInit(): void {
  }

  showDeletePrompt(formValue: any) {
      this.dialog.open(DeletePromptDialogComponent, {data: `Are you sure you want to remove package item ${formValue.name} ?` }).afterClosed().subscribe((doRemove) => {
        if( doRemove ) {

        }
      })
  }

}
