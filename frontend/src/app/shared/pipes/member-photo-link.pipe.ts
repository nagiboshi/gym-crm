import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'memberPhotoLink'
})
export class MemberPhotoLinkPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    console.log(value);
    if( value.startsWith("public")) {
      return value.replace("public", "/api");
    }
    return value;
  }

}
