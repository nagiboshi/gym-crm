import { Pipe, PipeTransform } from '@angular/core';
import {MembershipGroup} from '@models/membership-group';

@Pipe({
  name: 'comaSeparatedMembership'
})
export class ComaSeparatedMembershipPipe implements PipeTransform {

  transform(membership: MembershipGroup, ...args: unknown[]): unknown {
    return membership.memberships.map(m => m.name).join(", ");
  }

}
