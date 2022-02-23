import {Pipe, PipeTransform} from '@angular/core';
import {InventoryItem} from './inventory-list/inventory-item';
import {Property, PropertyValue} from '@models/property';

@Pipe({
  name: 'properties'
})
export class InventoryPropertiesPipe implements PipeTransform {
  transform(value: InventoryItem, ...args: any[]): string {
    const [propertyToShow]: string[] = args;

    if( value.product ) {
      const property: Property = value.product.properties.find(p => p.name.toLowerCase() == propertyToShow.toLowerCase());
      if( property ) {
        const propertyId = property.id;
        const detail: PropertyValue = value.details.find( propValue => propValue.propertyId == propertyId );
        if( detail ) {
          return detail.value;
        }
      }
    }
    return 'N\\A';
  }

}
