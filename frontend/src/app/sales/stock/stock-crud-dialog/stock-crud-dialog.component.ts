import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Stock, StockProperty} from '@models/stock';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatChipInputEvent} from '@angular/material/chips/chip-input';
import {StockService} from '../stock.service';

@Component({
  selector: 'stock-crud-dialog',
  templateUrl: './stock-crud-dialog.component.html',
  styleUrls: ['./stock-crud-dialog.component.scss']
})
export class StockCrudDialogComponent implements OnInit {
  formGroup: FormGroup;
  stockProperties: FormArray;
  constructor(@Inject(MAT_DIALOG_DATA) public stock: Stock, private stockService: StockService, private fb: FormBuilder) {
  }

  _newStockPropertyFormGroup(stockProperty?: StockProperty) {
    if (!stockProperty) {
      stockProperty = {id: 0, name: '', values: []};
    }

    const propertyValues = new FormArray([]);
    stockProperty.values.forEach(option => {
      propertyValues.push(this.fb.group({
        id: [option.id],
        value: [option.value, Validators.required],
      }));
    });
    return this.fb.group({
      id: [stockProperty.id],
      name: [stockProperty.name, Validators.required],
      values: propertyValues
    });
  }




  ngOnInit(): void {
    this.stockProperties = new FormArray([]);

    if (this.stock.id != 0) {
      this.stockService.getStockWithProperties(this.stock.id).toPromise().then((stockWithProperties)=>{
        stockWithProperties.properties.forEach(property => {
          this.addStockProperty(property);
        });
      });
    } else {
      this.stock.properties.forEach( property => this.addStockProperty(property));
    }




    this.formGroup = this.fb.group({
      id: [this.stock.id],
      name: [this.stock.name, Validators.required],
      qty: [this.stock.qty ?? 0, [Validators.min(0)]],
      price: [this.stock.price, [Validators.min(0)]],
      properties: this.stockProperties,
    });
  }

  addStockProperty(stockProperty?: StockProperty) {
    this.stockProperties.push(this._newStockPropertyFormGroup(stockProperty));
  }


  addPropertyValue(stockPropertiesArray: FormArray, $event: MatChipInputEvent, inputFieldElRef: HTMLInputElement) {
    stockPropertiesArray.push(this.fb.group({
      id: [0, null],
      value: [$event.value, Validators.required],
    }));
    inputFieldElRef.value = '';
  }

  removeFieldValue(stockPropertyValuesFormArray: FormArray, index: number) {
    stockPropertyValuesFormArray.removeAt(index);
  }


  removeField(index: number) {
    this.stockProperties.removeAt(index);
  }

}
