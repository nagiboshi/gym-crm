import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ClassCategory} from '../../classes/class.category';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-create-class-dialog',
  templateUrl: './create-class-dialog.component.html',
  styleUrls: ['./create-class-dialog.component.scss']
})
export class CreateClassDialogComponent implements OnInit {
  formGroup: FormGroup;
  classCategory: ClassCategory;
  constructor(private fb: FormBuilder,  @Inject(MAT_DIALOG_DATA) private _classCategory: ClassCategory) { }

  ngOnInit(): void {
    this.classCategory = this._classCategory;
    this.formGroup = this.fb.group({
      id: [this.classCategory.id],
      name: [this.classCategory.name, [Validators.required]]
    });
  }

  merge() {
    console.log('class category : : : ', this.classCategory);
    console.log('form result : : : : ', this.formGroup.value);
    // Object.assign( this.classCategory, this.formGroup.value);
  }

}
