import { Pipe, PipeTransform } from '@angular/core';
import {BranchService} from '../../settings/settings-page/branch.service';

@Pipe({
  name: 'branchName'
})
export class BranchNamePipe implements PipeTransform {

  constructor(private branchService: BranchService) {
  }


  transform(value: any, ...args: number[]): unknown {
    let [branchId] = args;
    if( !branchId ) {
      return 'All';
    }
    return this.branchService.getBranches().find( c => c.id == branchId).name;
  }

}
