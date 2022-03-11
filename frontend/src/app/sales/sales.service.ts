import {Injectable} from '@angular/core';
import {MembershipPurchaseHistoryItem, ServicePurchaseModel} from '@models/membership-purchase';
import {Observable} from 'rxjs';
import {RequestQueryBuilder} from '@nestjsx/crud-request';
import {HttpClient} from '@angular/common/http';
import {Moment} from 'moment';
import * as _moment from 'moment';
import {HelpersService} from '@shared/helpers.service';
import {StockPurchase} from '@models/stock-purchase';

const moment = _moment;
const threeDaysTS = 2.592e+8;

@Injectable({providedIn: 'root'})
export class SalesService {

  constructor(private httpClient: HttpClient, private helpers: HelpersService) {
  }

  saveStockPurchase(purchase: StockPurchase): Observable<StockPurchase> {
    return this.httpClient.post<StockPurchase>('/api/stock-purchase', purchase);
  }

  savePurchase(purchase: ServicePurchaseModel): Observable<ServicePurchaseModel> {
    const query = '/?' + RequestQueryBuilder.create()
      .setJoin({field: 'members'})
      .setJoin({field: 'members.activeMembership'})
      .setJoin({field: 'members.activeMembership.membership'})
      .setJoin({field: 'membership'})
      .setJoin({field: 'freeze'})
      .query(false);
    return this.httpClient.post<ServicePurchaseModel>('/api/membership-purchase' + query, purchase);
  }


  toPurchaseItemModel(purchaseHistoryItem: MembershipPurchaseHistoryItem ): ServicePurchaseModel {
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
      startDate: purchaseHistoryItem.startDate,

    }
  }

  /**
   * @deprecated
   * @param purchaseItem
   * @param expirationMoment
   */
  toPurchaseHistoryItem(purchaseItem: ServicePurchaseModel, expirationMoment: Moment): MembershipPurchaseHistoryItem {
    if( !purchaseItem ) {
      return;
    }

    if( purchaseItem.freeze ) {
      purchaseItem.freeze.startDate = purchaseItem.freeze.startDate?new Date(purchaseItem.freeze.startDate):null; // this.helpers.bigIntStringToNumber(purchaseItem.freeze.startDate);
      purchaseItem.freeze.endDate = purchaseItem.freeze.endDate?new Date(purchaseItem.freeze.endDate):null; // this.helpers.bigIntStringToNumber(purchaseItem.freeze.endDate);
    }
    //
    purchaseItem.startDate = new Date(purchaseItem.startDate); // this.helpers.bigIntStringToNumber(purchaseItem.startDate);
    purchaseItem.saleDate = new Date(purchaseItem.saleDate); // this.helpers.bigIntStringToNumber(purchaseItem.saleDate);

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