import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ClassCategory} from '../../../../classes/class.category';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {first} from 'lodash';
import {ClassModel} from '../../../../classes/class.model';
export interface ClassDialogData {
  classData: ClassModel;
  classCategories: ClassCategory[];
}

@Component({
  selector: 'app-create-class-dialog',
  templateUrl: './create-class-dialog.component.html',
  styleUrls: ['./create-class-dialog.component.scss']
})
export class CreateClassDialogComponent implements OnInit {
  formGroup: FormGroup;
  constructor(private dialogRef: MatDialogRef<CreateClassDialogComponent> ,private fb: FormBuilder,  @Inject(MAT_DIALOG_DATA) public data: ClassDialogData) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      id: [this.data.classData.id],
      name: [this.data.classData.name, [Validators.required]],
      categoryId: [this.data.classData.categoryId, [Validators.required]]
    });
  }

  merge() {
    this.dialogRef.close(this.formGroup.value);
  }

}
