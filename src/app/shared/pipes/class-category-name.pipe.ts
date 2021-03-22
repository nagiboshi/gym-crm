import {Pipe, PipeTransform} from '@angular/core';
import {MembershipItem} from '../../models/membership-item.model';
import {Moment} from 'moment';
import {DatePipe} from '@angular/common';
import {isNumber} from 'lodash';
import * as _moment from 'moment';
import {CommunicationService} from '../communication.service';
import {ClassModel} from '../../classes/class.model';

const moment = _moment;

@Pipe({
  name: 'classCategoryName'
})
export class ClassCategoryNamePipe implements PipeTransform {


  constructor(private communicationService: CommunicationService) {
  }

  transform(classModel: ClassModel, ...args: any[]): any {
    let [categoryId] = args;
    return this.communicationService.getClassCategories().find( c => c.id == categoryId).name;
  }

}
