import {Pipe, PipeTransform} from '@angular/core';
import {Membership} from '@models/membership';
import {Moment} from 'moment';
import {DatePipe} from '@angular/common';
import {isNumber} from 'lodash';
import * as _moment from 'moment';
import {CommunicationService} from '../communication.service';
import {ClassModel} from '../../classes/class.model';
import {ClassesService} from '../../classes/classes.service';

const moment = _moment;

@Pipe({
  name: 'classCategoryName'
})
export class ClassCategoryNamePipe implements PipeTransform {


  constructor(private classesService: ClassesService) {
  }

  transform(classModel: ClassModel, ...args: any[]): any {
    let [categoryId] = args;
    return this.classesService.getClassCategories().find( c => c.id == categoryId).name;
  }

}
