import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Supplier} from '@models/supplier';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Property} from '@models/property';
import {MatChipInputEvent} from '@angular/material/chips/chip-input';
@Component({
  selector: 'suppliers-crud',
  templateUrl: './suppliers-crud.component.html',
  styleUrls: ['./suppliers-crud.component.scss']
})
export class SuppliersCrudComponent implements OnInit {
  formGroup: FormGroup;
  properties: FormArray;

  constructor(@Inject(MAT_DIALOG_DATA) public supplier: Supplier, private fb: FormBuilder) { }

  _newSupplierPropertyFormGroup(property?: Property) {
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

    this.supplier.properties.forEach((property) => {

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
      id: [this.supplier.id],
      name: [this.supplier.name, Validators.required],
      properties: this.properties,
    })
  }

  addProperty() {
    this.properties.push( this._newSupplierPropertyFormGroup());
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

  removeProperty(index: number) {
    this.properties.removeAt(index);
  }
}
