import { Pipe, PipeTransform } from '@angular/core';
import {first} from 'lodash';
@Pipe({
  name: 'localImageLink'
})
export class LocalImageLinkPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): string {
    if ( Array.isArray(value)) {
      value = first(value);
    }

    if( value.startsWith("public")) {
      return value.replace("public", "/api");
    }
    return value;
  }

}
