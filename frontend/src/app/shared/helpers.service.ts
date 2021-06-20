import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor() { }

  toFormData(obj: any){
    const formData = new FormData();
    for (let key in obj) {
      formData.set(key, obj[key]);
    }
    return formData;
  }



  getTotalFreezeDays(endDate: number, startDate: number ) {
    return Math.round( (endDate - startDate ) / (1000*60*60*24));
  }
  // In db we saving date as bigint and in js it returns as a string
  // so we need to conver it to int
  bigIntStringToNumber(bigIntValue) {
    if( typeof bigIntValue == 'string' ) {
      return parseInt(bigIntValue);
    }
    return bigIntValue;
  }
}
