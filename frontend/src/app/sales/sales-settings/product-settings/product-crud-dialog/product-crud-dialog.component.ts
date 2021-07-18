import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Product, ProductCategory, ProductField, ProductSubcategory} from '@models/product';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips/chip-input';
import {ProductService} from '../product.service';
import {Observable, of} from 'rxjs';
import {MatSelectChange} from '@angular/material/select';

@Component({
  selector: 'app-product-crud-dialog',
  templateUrl: './product-crud-dialog.component.html',
  styleUrls: ['./product-crud-dialog.component.scss']
})
export class ProductCrudDialogComponent implements OnInit {
  formGroup: FormGroup;
  productFields: FormArray;
  categories: ProductCategory[];
  subcategories$: Observable<ProductSubcategory[]> = of([]);
  // propertiesArray: FormArray;
  // productSubcategories: Array<ProductSubcategory>;
  productTags: FormArray;

  constructor(@Inject(MAT_DIALOG_DATA) public product: Product, private fb: FormBuilder, private service: ProductService) { }

  _newProductFieldFormGroup(productField?: ProductField) {
    if( !productField ) {
      productField = {id: 0, name: "", options: []};
    }

    const fieldValues = new FormArray([]);
    productField.options.forEach( option => {
      fieldValues.push(this.fb.group({
        id: [option.id, null],
        value: [option.value, Validators.required],
      }))
    });
   return this.fb.group({
           id: [productField.id],
           name: [productField.name, Validators.required],
           options: fieldValues
         })
  }



  ngOnInit(): void {
    this.productFields = new FormArray([]);
    this.productTags = new FormArray([]);
    this.categories = this.service.getCategories();
    // this.productSubcategories = this.service.getSubcategories();
    // this.propertiesArray = new FormArray([]);

   //  this.product.properties.forEach((propertyType) => {
   //
   //    const propertiesArray = new FormArray([]);
   //    propertyType.properties.forEach((property: ProductProperty) => {
   //      propertiesArray.push(this.fb.group({
   //        id: [property.id],
   //        name: [property.name, Validators.required],
   //        propertyType: [propertyType]
   //      }))
   //    })
   //    this.propertyTypesArray.push(this.fb.group({
   //      id: [propertyType.id],
   //      name: [propertyType.name, Validators.required],
   //      properties: [propertiesArray]
   //    }))
   //  }
   // );

    this.formGroup = this.fb.group({
      id: [this.product.id],
      name: [this.product.name, Validators.required],
      subcategory: [this.product.subcategory, Validators.required],
      fields: this.productFields,
      tags: this.productTags
    })
  }

  addProductPropertyType() {
    this.productFields.push( this._newProductFieldFormGroup());
  }

  addTag( $event: MatChipInputEvent, fieldValueElRef: HTMLInputElement) {
      this.productTags.push(this.fb.group({
        id: 0,
        value: $event.value
      }));

    fieldValueElRef.value = "";
  }


  addField(productFieldsArray: FormArray, $event: MatChipInputEvent, inputFieldElRef: HTMLInputElement ) {
    productFieldsArray.push(this.fb.group({
      id: [0, null],
      value: [$event.value, Validators.required],
    }));
    inputFieldElRef.value = "";
  }

  removeField(productFieldValuesFormArray: FormArray, index: number) {
    productFieldValuesFormArray.removeAt(index);
  }

  removeTag(productTagIndex: number) {
    this.productTags.removeAt(productTagIndex);
  }

  updateSubcategories(e: MatSelectChange) {
      console.log("subcategories update ! " , e);
      const category = e.value as ProductCategory;
      this.subcategories$ = of(category.subcategories);
  }
}
