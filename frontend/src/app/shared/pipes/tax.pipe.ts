import { Pipe, PipeTransform } from '@angular/core';
import {Tax} from '@models/tax';

@Pipe({
  name: 'tax'
})
export class TaxPipe implements PipeTransform {

  toNumber(arg: unknown): number {
    if( arg && typeof  arg == 'string') {
      arg = parseInt(arg);
    }
    return arg as number;
  }


  transform(value: any, ...govTaxes: any[]): number {
    const [taxes] = govTaxes;

    if( Array.isArray(taxes)) {
      govTaxes = taxes;
    }
    return govTaxes.map((tax) => value * (tax.value / 100)).reduce((acc, next) => acc + next);
  }

}
