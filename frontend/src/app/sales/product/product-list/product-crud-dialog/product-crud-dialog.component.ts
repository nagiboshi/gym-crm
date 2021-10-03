import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Product} from '@models/product';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips/chip-input';
import {Observable, of} from 'rxjs';
import {MatSelectChange} from '@angular/material/select';
import {DomSanitizer} from '@angular/platform-browser';
import {ProductService} from '../../product.service';
import {Category, Subcategory} from '@models/category';
import {Property} from '@models/property';
import {CategoryService} from '../../../category/category.service';

@Component({
  selector: 'product-crud-dialog',
  templateUrl: './product-crud-dialog.component.html',
  styleUrls: ['./product-crud-dialog.component.scss']
})
export class ProductCrudDialogComponent implements OnInit {
  @ViewChild('productImageChoose')
  productImageChoose: ElementRef;
  @ViewChild('productPreview')
  productPreviewElRef: ElementRef;
  formGroup: FormGroup;
  properties: FormArray;
  categories: Promise<Category[]>;
  subcategories$: Observable<Subcategory[]>;

  constructor(@Inject(MAT_DIALOG_DATA) public product: Product, private fb: FormBuilder,
                private domSanitizer: DomSanitizer,private cagetoryService: CategoryService, private service: ProductService) { }

  _newProductPropertyFormGroup(property?: Property) {
    if( !property ) {
      property = {id: 0, name: "", values: []};
    }

    const propertyValues = new FormArray([]);
    property.values.forEach( propertyValue => {
      propertyValues.push(this.fb.group({
        id: [propertyValue.id, null],
        value: [propertyValue.value, Validators.required],
      }))
    });
   return this.fb.group({
           id: [property.id],
           name: [property.name, Validators.required],
           values: propertyValues
         })
  }

  ngOnInit(): void {
    this.properties = new FormArray([]);
    this.categories = this.cagetoryService.getCategories();


    if( this.product.subcategory ){
      this.categories.then(( fetchedCategories) => {
        const category = fetchedCategories.find(cat =>
                  cat.subcategories.find( subcat => subcat.id == this.product.subcategoryId) != null);
        this.subcategories$ = of(category.subcategories);
      });
    }

    this.product.properties.forEach((property) => {

      const propertyValuesArray = new FormArray([]);
      property.values.forEach( propertyValue => {
        propertyValuesArray.push(this.fb.group({
          id: [propertyValue.id],
          value: [propertyValue.value]
        }));
      });
        this.properties.push(this.fb.group({
          id: [property.id],
          name: [property.name, Validators.required],
          values: propertyValuesArray
        }))
    }
   );

    this.formGroup = this.fb.group({
      id: [this.product.id],
      name: [this.product.name, Validators.required],
      subcategory: [this.product.subcategory, Validators.required],
      properties: this.properties,
      images: []
    })
  }

  compareEntitiesById(cat1, cat2) {
    return cat1.id == cat2.id;
  }

  addProductProperty() {
    this.properties.push( this._newProductPropertyFormGroup());
  }

  addPropertyValue(propertiesArray: FormArray, $event: MatChipInputEvent, inputFieldElRef: HTMLInputElement ) {
    propertiesArray.push(this.fb.group({
      id: [0, null],
      value: [$event.value, Validators.required],
    }));
    inputFieldElRef.value = "";
  }

  removePropertyValue(productFieldValuesFormArray: FormArray, index: number) {
    productFieldValuesFormArray.removeAt(index);
  }

  updateSubcategories(e: MatSelectChange) {
      const category = e.value as Category;
      this.subcategories$ = of(category.subcategories);
  }
  removeProperty(index: number) {
    this.properties.removeAt(index);
  }
}
