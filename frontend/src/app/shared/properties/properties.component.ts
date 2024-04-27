import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { emptyProperty, Property } from '@models/property';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isEmpty } from 'lodash';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss'],
})
export class PropertiesComponent implements OnInit, AfterViewInit {
  @Input()
  property: Property;
  @Output()
  remove: EventEmitter<Property> = new EventEmitter<Property>();
  @Output()
  changed: EventEmitter<Property> = new EventEmitter<Property>();
  @Input()
  useMultipleValue: boolean = true;

  @ViewChild('propertyValueElRef')
  inputField: ElementRef;

  formGroup: FormGroup;
  propertyValues: FormArray;

  constructor(private fb: FormBuilder) {}

  saveProperty() {
    if (this.formGroup.valid) {
      this.changed.emit(this.formGroup.value as Property);
    }
  }

  ngOnInit(): void {
    if (!this.property) {
      this.property = emptyProperty();
    }
    this.propertyValues = new FormArray([]);
    this.property.values.forEach((option) => {
      this.propertyValues.push(
        this.fb.group({
          id: [option.id],
          value: [option.value, Validators.required],
        })
      );
    });
    this.formGroup = this.fb.group({
      id: [this.property.id],
      name: [this.property.name, Validators.required],
      values: this.propertyValues,
    });
  }

  addPropertyValue(
    $event: MatChipInputEvent,
    inputFieldElRef: HTMLInputElement
  ) {
    if (!$event) {
      const inputValue = inputFieldElRef.value;
      if (!isEmpty(inputValue)) {
        this.propertyValues.push(
          this.fb.group({
            id: [0],
            value: [inputValue, Validators.required],
          })
        );

        this.changed.emit(this.formGroup.value);
      }
      return;
    }

    if (!isEmpty($event.value.trim())) {
      this.propertyValues.push(
        this.fb.group({
          id: [0],
          value: [$event.value, Validators.required],
        })
      );
      inputFieldElRef.value = '';
      this.changed.emit(this.formGroup.value);
    }
  }

  removePropertyValue(index: number) {
    this.propertyValues.removeAt(index);
    this.changed.emit(this.formGroup.value);
  }

  removeProperty() {
    this.remove.emit(this.property);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.inputField.nativeElement.focus();
    }, 0);
  }
}
