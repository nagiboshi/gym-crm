import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'delimeterSeparatedValue'
})
export class DelimeterSeparatedValuePipe implements PipeTransform {

  transform(value: Array<any>, ...args: string[]): unknown {
    const [field, delimeter] = args;

    if( !value ) {
      return;
    }

    value = value.map( singleValue => singleValue[field]);
    return value.join(delimeter);
  }

}
