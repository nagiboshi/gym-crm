import {Injectable} from '@angular/core';
import {MembershipPurchaseHistoryItem, MembershipPurchaseModel} from '@models/membership-purchase';
import {Observable} from 'rxjs';
import {RequestQueryBuilder} from '@nestjsx/crud-request';
import {HttpClient} from '@angular/common/http';
import {Moment} from 'moment';
import * as _moment from 'moment';
import {HelpersService} from '@shared/helpers.service';

const moment = _moment;
const threeDaysTS = 2.592e+8;

@Injectable({providedIn: 'root'})
export class SalesService {

  constructor(private httpClient: HttpClient, private helpers: HelpersService) {
  }

  savePurchase(purchase: MembershipPurchaseModel): Observable<MembershipPurchaseModel> {
    const query = '/?' + RequestQueryBuilder.create()
      .setJoin({field: 'members'})
      .setJoin({field: 'membership'})
      .setJoin({field: 'freeze'})
      .query(false);
    return this.httpClient.post<MembershipPurchaseModel>('/api/membership-purchase' + query, purchase);
  }


  // getActiveMembership(memberId: number): Observable<PurchaseHistoryItem> {
  //   const query = '/?' + RequestQueryBuilder.create()
  //     .setJoin({field: 'product'})
  //     .setFilter({field: 'members.id', })
  //     .query(false)
  // }



  toPurchaseItemModel(purchaseHistoryItem: MembershipPurchaseHistoryItem ): MembershipPurchaseModel {
    return {
      id: purchaseHistoryItem.id,
      members: purchaseHistoryItem.members,
      membershipId: purchaseHistoryItem.membershipId,
      membership: purchaseHistoryItem.membership,
      note: purchaseHistoryItem.note,
      freeze: purchaseHistoryItem.freeze,
      freezeId: purchaseHistoryItem.freezeId,
      paymentMethodId: purchaseHistoryItem.paymentMethodId,
      price: purchaseHistoryItem.price,
      saleDate: purchaseHistoryItem.saleDate,
      startDate: purchaseHistoryItem.startDate
    }
  }


  toPurchaseHistoryItem(purchaseItem: MembershipPurchaseModel, expirationMoment: Moment): MembershipPurchaseHistoryItem {
    if( !purchaseItem ) {
      return;
    }

    if( purchaseItem.freeze ) {
      purchaseItem.freeze.startDate = this.helpers.bigIntStringToNumber(purchaseItem.freeze.startDate);
      purchaseItem.freeze.endDate = this.helpers.bigIntStringToNumber(purchaseItem.freeze.endDate);
    }

    purchaseItem.startDate = this.helpers.bigIntStringToNumber(purchaseItem.startDate);
    purchaseItem.saleDate = this.helpers.bigIntStringToNumber(purchaseItem.saleDate);

    const purchaseExpiration = moment(purchaseItem.startDate)
      .add(purchaseItem.membership.expirationLength, purchaseItem.membership.expirationType).startOf('day')
      .toDate().getTime();

    const expirationTimeLeft = expirationMoment.clone().subtract(purchaseExpiration, 'milliseconds').startOf('day').toDate().getTime();

    return {
      ...purchaseItem, isExpired: expirationMoment.toDate().getTime() >= purchaseExpiration,
      isFreezed: purchaseItem.freeze && purchaseItem.freeze.endDate == null,
      isNearlyExpire: expirationTimeLeft > 0 && expirationTimeLeft <= threeDaysTS
    };
  }
}
