import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localImageLink'
})
export class LocalImageLinkPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    if( value.startsWith("public")) {
      return value.replace("public", "/api");
    }
    return value;
  }

}
