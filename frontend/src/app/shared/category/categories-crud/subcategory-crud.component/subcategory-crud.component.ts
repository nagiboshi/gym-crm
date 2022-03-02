import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Subcategory} from '@models/category';
import {cloneDeep} from 'lodash';
import {Property} from '@models/property';

@Component({
  selector: 'subcategory-crud',
  templateUrl: './subcategory-crud.component.html',
  styleUrls: ['./subcategory-crud.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubcategoryCrudComponent implements OnInit {
  formGroup: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public subcategory: Subcategory, private fb: FormBuilder) {
  }

  ngOnInit(): void {

    if (!this.subcategory) {
      this.subcategory = {id: 0, name: '', categoryId: null, properties: []};
    }

    this.formGroup = this.fb.group({
      id: [this.subcategory.id],
      name: [this.subcategory.name, [Validators.required, Validators.pattern('^[A-Za-z0-9 ]+$')]],
      categoryId: [this.subcategory.categoryId, [Validators.required]],
      properties: null
    });
  }

  updatedProperties(properties: Property[]) {
    this.formGroup.patchValue({properties: properties});
  }
}
