import { Pipe, PipeTransform } from '@angular/core';
import {ClassModel} from '../../classes/class.model';
import {ClassesService} from '../../classes/classes.service';
import {CommunicationService} from '@shared/communication.service';

@Pipe({
  name: 'branchName'
})
export class BranchNamePipe implements PipeTransform {

  constructor(private communicationService: CommunicationService) {
  }


  transform(value: any, ...args: number[]): unknown {
    let [branchId] = args;
    if( !branchId ) {
      return 'All';
    }
    return this.communicationService.getBranches().find( c => c.id == branchId).name;
  }

}
