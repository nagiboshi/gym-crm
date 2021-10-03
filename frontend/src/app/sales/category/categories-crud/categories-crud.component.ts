import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category, Subcategory} from '@models/category';

@Component({
  selector: 'product-categories-crud',
  templateUrl: './categories-crud.component.html',
  styleUrls: ['./categories-crud.component.scss']
})
export class CategoriesCrudComponent implements OnInit {
  formGroup: FormGroup;
  subcategoriesFormArray: FormArray = new FormArray([]);

  constructor(@Inject(MAT_DIALOG_DATA) private category: Category,
              private fb: FormBuilder,
              private matDialogRef: MatDialogRef<CategoriesCrudComponent>) {

  }

  ngOnInit(): void {

    this.formGroup = this.fb.group({
      id: [this.category.id],
      name: [this.category.name, [Validators.required, Validators.pattern('^[A-Za-z0-9 ]+$')]],
      description: [this.category.description],
      subcategories: this.subcategoriesFormArray
    });

    this.category.subcategories.forEach(subcategory => this.subcategoriesFormArray.push(this._newSubcategoryFormGroup(subcategory)));
  }

  _newSubcategoryFormGroup(subcategory?: Subcategory) {
    if (!subcategory) {
      subcategory = {id: 0, name: '', description: '', category: this.category};
    }
    return this.fb.group({
      id: [subcategory.id],
      name: [subcategory.name, [Validators.required, Validators.pattern('^[A-Za-z0-9 ]+$')]],
      description: [subcategory.description]
    });
  }

  addSubcategory() {
    this.subcategoriesFormArray.push(this._newSubcategoryFormGroup());
  }


  save() {
    this.matDialogRef.close(this.formGroup.value);
  }

  removeSubcategory(index) {
    this.subcategoriesFormArray.removeAt(index);
  }
}
