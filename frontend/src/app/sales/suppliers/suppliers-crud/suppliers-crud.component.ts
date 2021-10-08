import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Supplier} from '@models/supplier';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Property} from '@models/property';
import {first, isEmpty} from 'lodash';
@Component({
  selector: 'suppliers-crud',
  templateUrl: './suppliers-crud.component.html',
  styleUrls: ['./suppliers-crud.component.scss']
})
export class SuppliersCrudComponent implements OnInit {
  formGroup: FormGroup;
  properties: FormArray;

  constructor(@Inject(MAT_DIALOG_DATA) public supplier: Supplier, private dialogRef: MatDialogRef<SuppliersCrudComponent>, private fb: FormBuilder) { }

  _newSupplierPropertyFormGroup(property?: Property) {
    if( !property ) {
      property = {id: 0, name: "", values: [{id: 0, value: ""}]};
    }

    const supplierPropertyValue = first(property.values);
    return this.fb.group({
      id: [property.id],
      name: [property.name, Validators.required],
      propertyValueId: [supplierPropertyValue.id],
      value: [supplierPropertyValue.value, Validators.required]
    })
  }

  ngOnInit(): void {
    this.properties = new FormArray([]);
    this.supplier?.properties.forEach((property) => {
      const supplierPropertyValue = first(property.values) ?? this.newSupplierProperty();
        this.properties.push(this.fb.group({
          id: [property.id],
          name: [property.name, Validators.required],
          propertyValueId: [supplierPropertyValue.id],
          value: [supplierPropertyValue.value, Validators.required]
        }))
      }
    );

    this.formGroup = this.fb.group({
      id: [this.supplier.id],
      name: [this.supplier.name, Validators.required],
      properties: this.properties,
    })
  }

  newSupplierProperty() {
    return {id: 0, value: ""};
  }

  addProperty() {
    this.properties.push( this._newSupplierPropertyFormGroup());
  }

  removeProperty(index: number) {
    this.properties.removeAt(index);
  }

  convertToSupplier(form: FormGroup) {
    const supplier: Supplier =  {id: form.value.id, name: form.value.name, properties: []};


    form.value.properties.forEach( (property) => {
      supplier.properties.push({id: property.id, name: property.name, values: [{id: property.propertyValueId, value: property.value}]});
    })

    return supplier
  }

  saveSupplier() {
    const supplier = this.convertToSupplier(this.formGroup);
    this.dialogRef.close(supplier);
  }
}
