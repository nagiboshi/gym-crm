import {Injectable} from '@angular/core';
import {ExtendedMembershipPurchaseModel, MembershipPurchaseModel} from '@models/membership-purchase';
import {Observable} from 'rxjs';
import {RequestQueryBuilder} from '@nestjsx/crud-request';
import {HttpClient} from '@angular/common/http';
import {Moment} from 'moment';
import * as _moment from 'moment';
import {HelpersService} from '@shared/helpers.service';
import {StockPurchase} from '@models/stock-purchase';
import {Payment} from '@models/payment';

const moment = _moment;
const threeDaysTS = 2.592e+8;

@Injectable({providedIn: 'root'})
export class SalesService {

  constructor(private httpClient: HttpClient, private helpers: HelpersService) {
  }

  saveStockPurchase(purchase: StockPurchase): Observable<StockPurchase> {
    return this.httpClient.post<StockPurchase>('/api/stock-purchase', purchase);
  }

  createPayments(payments: Payment[]): Promise<Payment[]> {
    return this.httpClient.post<Payment[]>('/api/payment/bulk', {bulk: payments}).toPromise();
  }

  deletePayments(payments: Payment[]): Promise<Payment[]> {
    const promises = [];
    payments.forEach( p => promises.push(this.httpClient.delete(`/api/payment/${p.id}`).toPromise()));
    return Promise.all(promises);
  }

  savePurchase(purchase: MembershipPurchaseModel): Observable<MembershipPurchaseModel> {
    const query = '/?' + RequestQueryBuilder.create()
      .setJoin({field: 'membership'})
      .setJoin({field: 'members'})
      .setJoin({field: 'members.activeMembership'})
      .setJoin({field: 'members.activeMembership.membership'})
      .setJoin({field: 'members.activeMembership.payments'})
      .setJoin({field: 'freeze'})
      .query(false);
    return this.httpClient.post<MembershipPurchaseModel>('/api/membership-purchase' + query, purchase);
  }


  toPurchaseItemModel(purchaseHistoryItem: ExtendedMembershipPurchaseModel ): MembershipPurchaseModel {
    return {
      id: purchaseHistoryItem.id,
      members: purchaseHistoryItem.members,
      membershipId: purchaseHistoryItem.membershipId,
      membership: purchaseHistoryItem.membership,
      discount: purchaseHistoryItem.discount,
      note: purchaseHistoryItem.note,
      payments: purchaseHistoryItem.payments,
      buyerId: purchaseHistoryItem.buyerId,
      freeze: purchaseHistoryItem.freeze,
      freezeId: purchaseHistoryItem.freezeId,
      price: purchaseHistoryItem.price,
      startDate: purchaseHistoryItem.startDate,
    }
  }

  /**
   * @deprecated
   * @param purchaseItem
   * @param expirationMoment
   */
  toPurchaseHistoryItem(purchaseItem: MembershipPurchaseModel, expirationMoment: Moment): ExtendedMembershipPurchaseModel {
    if( !purchaseItem ) {
      return;
    }

    if( purchaseItem.freeze ) {
      purchaseItem.freeze.startDate = purchaseItem.freeze.startDate?new Date(purchaseItem.freeze.startDate):null; // this.helpers.bigIntStringToNumber(purchaseItem.freeze.startDate);
      purchaseItem.freeze.endDate = purchaseItem.freeze.endDate?new Date(purchaseItem.freeze.endDate):null; // this.helpers.bigIntStringToNumber(purchaseItem.freeze.endDate);
    }
    //
    purchaseItem.startDate = new Date(purchaseItem.startDate); // this.helpers.bigIntStringToNumber(purchaseItem.startDate);

    const purchaseExpiration = moment(purchaseItem.startDate)
      .add(purchaseItem.membership.expirationLength, purchaseItem.membership.expirationType).startOf('day')
      .toDate().getTime();

    const expirationTimeLeft = expirationMoment.clone().subtract(purchaseExpiration, 'milliseconds').startOf('day').toDate().getTime();

    return {
      ...purchaseItem, isExpired: expirationMoment.toDate().getTime() >= purchaseExpiration,
      isFreezed: purchaseItem.freeze && purchaseItem.freeze.endDate == null,
      isFullyPaid: true,
      isNearlyExpire: expirationTimeLeft > 0 && expirationTimeLeft <= threeDaysTS
    };
  }
}
