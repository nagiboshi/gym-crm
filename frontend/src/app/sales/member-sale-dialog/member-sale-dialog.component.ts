import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Member} from '@models/member';
import {MembershipPurchaseHistoryItem, ServicePurchaseModel} from '@models/membership-purchase';
import {SalesService} from '../sales.service';
import * as _moment from 'moment';
import {StockPurchase} from '@models/stock-purchase';
import {HelpersService} from '@shared/helpers.service';

const moment = _moment;

@Component({
  selector: 'member-sale-dialog',
  templateUrl: './member-sale-dialog.component.html',
  styleUrls: ['./member-sale-dialog.component.scss']
})
export class MemberSaleDialogComponent implements OnInit {
  todayMoment = moment().startOf('day');

  constructor(@Inject(MAT_DIALOG_DATA) public member: Member,
              private salesService: SalesService,
              private helpers: HelpersService,
              private dialog: MatDialogRef<MemberSaleDialogComponent>) {
  }

  ngOnInit(): void {
  }

  async addSale(purchase: ServicePurchaseModel | StockPurchase, type: string) {

    if( type == 'stock') {
      if( purchase ) {
        let stockPurchase = purchase as StockPurchase;
        await this.salesService.saveStockPurchase(stockPurchase).toPromise();
      }
      this.dialog.close();
      return;
    }

    if ( type == 'service') {
      if (purchase) {
        const servicePurchase = purchase as ServicePurchaseModel;
        const savedMembershipPurchase = await this.salesService.savePurchase(servicePurchase).toPromise();
        const newPurchaseHistoryItem: MembershipPurchaseHistoryItem = this.helpers.extendMembership(savedMembershipPurchase);
        this.dialog.close(newPurchaseHistoryItem);
      }
    }
  }
}
