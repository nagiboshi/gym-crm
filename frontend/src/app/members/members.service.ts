import { Injectable } from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {Member} from '@models/member';
import {CondOperator, QueryFilter, RequestQueryBuilder} from '@nestjsx/crud-request';
import {isEmpty} from 'lodash';
import {HttpClient} from '@angular/common/http';
import {HelpersService} from '@shared/helpers.service';
import {map} from 'rxjs/operators';
import * as _moment from 'moment';

const moment = _moment;

@Injectable({providedIn: 'root'})
export class MembersService {
  memberCreated = new Subject<Member>();
  memberCreated$ = this.memberCreated.asObservable();

  constructor(private httpClient: HttpClient, private helpers: HelpersService) {

  }

  getMemberWithPurchases(id: string | number, joinPurchaseFreeze = true, joinPurchaseProduct = true, joinPurchaseMembers = true) {
    const query = RequestQueryBuilder.create()
      .setJoin({field: 'membershipPurchases'})
      .setJoin({field: 'membershipPurchases.membership'});
    if (joinPurchaseFreeze) {
      query.setJoin({field: 'membershipPurchases.freeze'});
    }


    if (joinPurchaseMembers) {
      query.setJoin({field: 'membershipPurchases.members'});
    }
    query.sortBy({
      field: 'membershipPurchases.saleDate',
      order: 'DESC'
    });
    const resultedQuery = '/?' + query.query(false);
    return this.httpClient.get<Member>('/api/member/' + id + resultedQuery).pipe(map<Member, Member>(member => {
      member.membershipPurchases?.forEach(p => {
        p.startDate = this.helpers.bigIntStringToNumber(p.startDate);
        p.saleDate = this.helpers.bigIntStringToNumber(p.saleDate);
        if (p.freeze) {
          p.freeze.startDate = this.helpers.bigIntStringToNumber(p.freeze.startDate);
          p.freeze.endDate = this.helpers.bigIntStringToNumber(p.freeze.endDate);
        }
      });
      return member;
    }));
  }

  removeMember(id: number) {
    return this.httpClient.delete('/api/member/' + id);
  }

  findMembers(firstLastNamePhoneNumber: string): Observable<Member[]> {
    return this.getMembers(20, firstLastNamePhoneNumber, 0);
  }

  getMembersByIds(ids: number[]): Observable<Member[]> {
    if (ids.length != 0) {
      let url = '/api/member';
      const query = '/?' + RequestQueryBuilder.create().setFilter({
        field: 'id',
        value: ids,
        operator: CondOperator.IN
      }).setJoin({field: 'membershipPurchases'})
        .setJoin({field: 'membershipPurchases.membership'})
        .sortBy({field: 'membershipPurchases.saleDate', order: 'DESC'}).query(false);
      return this.httpClient.get<Member[]>(url + query);
    }
    return of(new Array<Member>());
  }

  newMembersStatistic() {
    const startOfYear = moment().startOf('year').toDate().getTime();
    const currentDate = moment().toDate().getTime();
    return this.httpClient.get('/api/member/newMembersStatistic', {params: {from:startOfYear, to:currentDate}});
  }

  getMembers(size: number, filterNameLastNameOrPhone: string, offset: number): Observable<Member[]> {
    let url = '/api/member';
    if (!isEmpty(filterNameLastNameOrPhone)) {
      const query = '/?' + RequestQueryBuilder.create().setOr([
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
      ]).query(false);
      url += query;
    }
    return this.httpClient.get<Member[]>(url);
  }

  saveMember(member: Member): Observable<Member> {
    const formData: FormData = this.helpers.toFormData(member);
    return this.httpClient.post<Member>('/api/member', formData);
  }

  updateMember(member: Member) {
    return this.httpClient.patch<Member>('/api/member', JSON.stringify(member));
  }
}
