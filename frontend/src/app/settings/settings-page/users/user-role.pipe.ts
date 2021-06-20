import { Pipe, PipeTransform } from '@angular/core';
import {CommunicationService, UserRole} from '@shared/communication.service';

@Pipe({
  name: 'userRole'
})
export class UserRolePipe implements PipeTransform {
  constructor(private communicationService: CommunicationService) {
  }
  transform(key: number, ...args: unknown[]): unknown {
    return this.communicationService.getUserRoles().get(key).label;
  }

}
