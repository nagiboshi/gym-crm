import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {emptyProperty, Property} from '@models/property';
import {cloneDeep} from 'lodash';

@Component({
  selector: 'properties-crud',
  templateUrl: './properties-crud.component.html',
  styleUrls: ['./properties-crud.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertiesCrudComponent implements OnInit {
  @Input()
  properties: Property[];
  @Input()
  useMultipleValue: boolean = true;

  @Output()
  changedProperties: EventEmitter<Property[]> = new EventEmitter<Property[]>();
  editedProperties: Property[];
  constructor() { }

  ngOnInit(): void {
    if( !this.properties ) {
      this.editedProperties = [];
    } else {
      this.editedProperties = cloneDeep(this.properties);
    }
  }


  addProperty() {
    if (!this.editedProperties) {
      this.editedProperties = [];
    }

    this.editedProperties.push(emptyProperty());
  }

  saveProperty(newProperty: Property, idx: number) {
    this.editedProperties.splice(idx, 1, newProperty);
    this.changedProperties.emit(this.editedProperties);
  }

  removeProperty(_, idx: number) {
    this.editedProperties.splice(idx, 1);
    this.changedProperties.emit(this.editedProperties);
  }

}
