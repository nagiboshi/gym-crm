import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor() { }


  toNumber(arg: unknown): number {
    if( arg && typeof  arg == 'string') {
      arg = parseInt(arg);
    }
    return arg as number;
  }


  toFormData(obj: any, rootName?: string, ignoreList?: string) {
    const formData = new FormData();

    const appendFormData = (data, root) => {
      if (!ignore(root)) {
        root = root || '';
        if (data instanceof File) {
          formData.append(root, data);
        } else if (Array.isArray(data)) {
          for (let i = 0; i < data.length; i++) {
            let key = root + '[' + i + ']';
            if (data[i] instanceof File) {
              key = root + '[]';
            }
            appendFormData(data[i], key);
          }
        } else if (typeof data === 'object' && data) {
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              if (root === '') {
                appendFormData(data[key], key);
              } else {
                appendFormData(data[key], root + '.' + key);
              }
            }
          }
        } else {
          if (data !== null && typeof data !== 'undefined') {
            formData.append(root, data);
          }
        }
      }
    }

    const ignore = (root) => {
      return Array.isArray(ignoreList)
        && ignoreList.some(function(x) { return x === root; });
    }

    appendFormData(obj, rootName);

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
