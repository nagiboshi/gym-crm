import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MembershipGroup} from '@models/membership-group';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {remove} from 'lodash';
import {Membership} from '@models/membership';
import {flatten} from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class MembershipGroupService {
  membershipGroupsSubj = new BehaviorSubject<MembershipGroup[]>([]);
  membershipGroups$: Observable<MembershipGroup[]> = this.membershipGroupsSubj.asObservable();
  constructor(private httpClient: HttpClient) {

  }

  removeMembershipGroup(membershipGroup: MembershipGroup) {
    this.httpClient.delete(`/api/membershipGroup/${membershipGroup.id}`).pipe(tap( _ => {
      const membershipGroups = this.membershipGroupsSubj.getValue();
      remove(membershipGroups, p => p.id == membershipGroup.id);
      this.membershipGroupsSubj.next([...membershipGroups]);
    })).subscribe();
  }

  fetchMembershipGroups(type?: string): Observable<MembershipGroup[]> {
   return this.httpClient.get<MembershipGroup[]>('/api/membershipGroup?type=shared').pipe(tap(membershipGroups => this.membershipGroupsSubj.next(membershipGroups)) );
  }

  saveMembershipGroup(membershipGroup: MembershipGroup): Promise<MembershipGroup> {
    return new Promise<MembershipGroup>((resolve, reject) => {
      this.httpClient.post<MembershipGroup>('/api/membershipGroup', membershipGroup).toPromise().then((mergedMembershipGroups) => {
        const membershipGroups = this.membershipGroupsSubj.getValue();
        if (membershipGroup.id == 0) {
          this.membershipGroupsSubj.next([mergedMembershipGroups, ...membershipGroups]);
        } else {
          const membershipIndex = membershipGroups.findIndex( p => p.id == membershipGroup.id);
          if( membershipIndex != -1 ) {
            membershipGroups[membershipIndex] = mergedMembershipGroups;
            this.membershipGroupsSubj.next([...membershipGroups]);
          }
        }

        resolve(mergedMembershipGroups);
      }).catch( e => reject(e));
    });

  }


  getMembershipGroups$(): Observable<MembershipGroup[]> {
    return this.membershipGroups$;
  }

  getMembershipGroups(type: string): MembershipGroup[] {
    return this.membershipGroupsSubj.getValue().filter(m => type == 'local' ? m.type == type: true);
  }

}
