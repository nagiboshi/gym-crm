import { Pipe, PipeTransform } from '@angular/core';
import {ClassesService} from './classes.service';

@Pipe({
  name: 'classNameById'
})
export class ClassNameByIdPipe implements PipeTransform {

  constructor(private classService: ClassesService) {
  }

  transform(classId: number): string {
    return this.classService.getClasses().find( c => c.id === classId)?.name ?? 'No class';
  }

}
