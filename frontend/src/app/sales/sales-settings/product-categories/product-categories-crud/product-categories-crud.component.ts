import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductCategory, ProductSubcategory} from '@models/product';

@Component({
  selector: 'app-product-categories-crud',
  templateUrl: './product-categories-crud.component.html',
  styleUrls: ['./product-categories-crud.component.scss']
})
export class ProductCategoriesCrudComponent implements OnInit {
  formGroup: FormGroup;
  subcategoriesFormArray: FormArray = new FormArray([]);

  constructor(@Inject(MAT_DIALOG_DATA) private productCategory: ProductCategory,
              private fb: FormBuilder,
              private matDialogRef: MatDialogRef<ProductCategoriesCrudComponent>) {

  }

  ngOnInit(): void {

    this.formGroup = this.fb.group({
      id: [this.productCategory.id],
      name: [this.productCategory.name, [Validators.required, Validators.pattern('^[A-Za-z0-9 ]+$')]],
      description: [this.productCategory.description],
      subcategories: this.subcategoriesFormArray
    });

    this.productCategory.subcategories.forEach(subcategory => this.subcategoriesFormArray.push(this._newSubcategoryFormGroup(subcategory)));
  }

  _newSubcategoryFormGroup(subcategory?: ProductSubcategory) {
    if (!subcategory) {
      subcategory = {id: 0, name: '', description: '', category: this.productCategory};
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
