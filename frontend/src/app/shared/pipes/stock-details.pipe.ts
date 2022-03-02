import {Pipe, PipeTransform} from '@angular/core';
import {Property, PropertyValue} from '@models/property';

@Pipe({
  name: 'stockDetail'
})
export class StockDetailsPipe implements PipeTransform {

  constructor() {
  }

  transform(detail: PropertyValue, ...args: any[]): string {
    let [properties] = args;

    let stockDetails = '';

    const property = properties.find( (p) => p.id == detail.propertyId);

    if( property )  {
      stockDetails+= ` ${property.name}: ${detail.value}`;
    }

    return stockDetails;
  }

}
