import { Injectable } from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {Member} from '@models/member';
import {CondOperator, QueryFilter, QueryJoin, QuerySort, RequestQueryBuilder} from '@nestjsx/crud-request';
import {isEmpty} from 'lodash';
import {HttpClient} from '@angular/common/http';
import {HelpersService} from '@shared/helpers.service';
import {map} from 'rxjs/operators';
import * as _moment from 'moment';
import {Moment} from 'moment';
import {Page} from '@models/page';

const moment = _moment;

@Injectable({providedIn: 'root'})
export class MembersService {
  memberCreated = new Subject<Member>();
  memberCreated$ = this.memberCreated.asObservable();

  constructor(private httpClient: HttpClient, private helpers: HelpersService) {

  }

  getMemberWithMembershipInfo(id: string | number) {
    const query = RequestQueryBuilder.create()
      .setJoin({field: 'activeMembership'})
      .setJoin({field: 'activeMembership.freeze'})
      .setJoin({field: 'activeMembership.members'})
      .setJoin({field: 'activeMembership.membership'})
      .setJoin({field: 'activeMembership.payments'})
      .setJoin({field: 'socialAccounts'});
    const resultedQuery = '/?' + query.query(false);
    return this.httpClient.get<Member>('/api/member/' + id + resultedQuery)
      .pipe(map<Member, Member>(member => {
      member.membershipPurchases?.forEach(p => {
        p.startDate =  p.startDate ? new Date(p.startDate) : null; // this.helpers.bigIntStringToNumber(p.startDate);
        if (p.freeze) {
          p.freeze.startDate = p.freeze.startDate?new Date(p.freeze.startDate):null; // this.helpers.bigIntStringToNumber(p.freeze.startDate);
          p.freeze.endDate = p.freeze.endDate?new Date(p.freeze.endDate):null; //  this.helpers.bigIntStringToNumber(p.freeze.endDate);
        }
      });
      return member;
    }));
  }


  removeMember(id: number) {
    return this.httpClient.delete('/api/member/' + id);
  }

  findMembers(firstLastNamePhoneNumber: string): Observable<Page<Member>> {
    return this.getMembers(20, firstLastNamePhoneNumber, 0, 'shared');
  }

  getMembersByIds(ids: number[], joinFields?:QueryJoin[], querySort?: QuerySort): Observable<Member[]> {
    if (ids.length != 0) {
      let url = '/api/member';
      const query = RequestQueryBuilder.create().setFilter({
        field: 'id',
        value: ids,
        operator: CondOperator.IN
      });
      if( joinFields ) {
        query.setJoin(joinFields);
      }
      if(querySort) {
        query.sortBy(querySort);
      }
      const queryString = '/?' + query.query(false);
      return this.httpClient.get<Member[]>(url + queryString);
    }
    return of(new Array<Member>());
  }

  newMembersStatistic() {
    const startOfYear = moment().startOf('year').toDate().getTime();
    const currentDate = moment().toDate().getTime();
    return this.httpClient.get('/api/member/newMembersStatistic', {params: {from:startOfYear, to:currentDate}});
  }

  getMembers(size: number, filterNameLastNameOrPhone: string, offset: number, type: 'local'|'shared' ): Observable<Page<Member>> {
    let url = '/api/member';

    const queryBuilder = RequestQueryBuilder.create();

    if (!isEmpty(filterNameLastNameOrPhone)) {
      queryBuilder.setOr([
        {
          field: 'firstName',
          operator: CondOperator.CONTAINS,
          value: filterNameLastNameOrPhone
        },
        {
          field: 'lastName',
          operator: CondOperator.CONTAINS,
          value: filterNameLastNameOrPhone
        },
        {
          field: 'phoneNumber',
          operator: CondOperator.CONTAINS,
          value: filterNameLastNameOrPhone
        },
      ]);

    }
    url += "?type=" + type + "&" + queryBuilder.query(false);

    return this.httpClient.get<Page<Member>>(url);
  }

  saveMember(member: Member): Observable<Member> {
    if( moment.isMoment(member.dob)) {
        const dob: Moment = member.dob;
        member.dob = dob.toDate();
    }

    const formData: FormData = this.helpers.toFormData(member);
    console.log('Form Data ::: ', formData);
    return this.httpClient.post<Member>('/api/member', formData);
  }

  updateMember(member: Member, queryFields? :RequestQueryBuilder): Observable<Member> {
    let query="";
    if( queryFields ) {
      query+="?" + queryFields.query(false);
    }
    return this.httpClient.patch<Member>(`/api/member/${member.id}${query}`, member);
  }
}
