import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Package} from '../../../../models/package';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DeletePromptDialogComponent} from '@shared/delete-prompt-dialog/delete-prompt-dialog.component';
import {PackageItem} from '../../../../models/package-item';

@Component({
  selector: 'app-sales-dialog',
  templateUrl: './sales-dialog.component.html',
  styleUrls: ['./sales-dialog.component.scss']
})
export class SalesDialogComponent implements OnInit {
  formGroup: FormGroup;
  packageItemsArray: FormArray;

  constructor(@Inject(MAT_DIALOG_DATA) public packageEl: Package,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<SalesDialogComponent>,
              private dialog: MatDialog) {

    this.packageItemsArray = new FormArray([]);

    packageEl.items.forEach((item) => {
      this.packageItemsArray.push(
        this.newPackageItemFormGroup(item)
      );
    });

    this.formGroup = fb.group({
      id: this.packageEl.id,
      name: [this.packageEl.name, Validators.required],
      items: this.packageItemsArray
    });
  }


  newPackageItemFormGroup(item?: PackageItem) {
    return this.fb.group({
      id: [item?.id ?? 0],
      name: [item?.name, [Validators.required]],
      isShared: [item?.isShared],
      numberOfParticipants  : [item?.numberOfParticipants ?? 1, [Validators.required]],
      expirationType: [item?.expirationType, Validators.required],
      expirationLength: [item?.expirationLength, Validators.required],
    })
  }

  submit() {
    this.dialogRef.close(this.formGroup.value);
  }

  ngOnInit(): void {
  }

  showDeletePrompt(index: number, formValue: any) {
      this.dialog.open(DeletePromptDialogComponent, {data: `Are you sure you want to remove package item ${formValue.name} ?` }).afterClosed().subscribe((doRemove) => {
        if( doRemove ) {
            this.packageItemsArray.removeAt(index);
            this.formGroup.markAsDirty();
        }
      })
  }

  addPackageItem() {
    this.packageItemsArray.push(this.newPackageItemFormGroup())
  }
}
