import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {CommunicationService, DaySchedule} from '../../../shared/communication.service';
import {Member} from '../../../models/member.model';
import {ScheduleMember} from '../../../models/schedule-member.model';
import {Moment} from 'moment';
import * as _moment from 'moment';
import {remove, groupBy, sortBy, Dictionary, first} from 'lodash';
import {PurchaseHistoryItem, PurchaseItem, toPurchaseHistoryItem} from '../../../models/purchase.model';
import {PurchaseFormComponent} from '../../../sales/purchase-form/purchase-form.component';
import {Router} from '@angular/router';

export interface SignInDialogData {
  daySchedule: DaySchedule;
  signInDate: Moment;
  purchaseItems: PurchaseItem[];
}

export interface SignInMember {
  scheduleMember: ScheduleMember;
  activeMembership: PurchaseHistoryItem;
}

const moment = _moment;

@Component({
  selector: 'app-sign-in-dialog',
  templateUrl: './sign-in-dialog.component.html',
  styleUrls: ['./sign-in-dialog.component.scss']
})
export class SignInDialogComponent implements OnInit {
  scheduleMembers: ScheduleMember[];
  purchaseItems: PurchaseHistoryItem[];
  memberIdToPurchaseItem: Dictionary<PurchaseHistoryItem[]>;
  signInMembers: SignInMember[];
  today = moment();
  displayedColumns: string[] = ['fullName', 'package', 'expiryDate', 'sell' ];
  constructor(@Inject(MAT_DIALOG_DATA) public signInDialogData: SignInDialogData,
              private communicationService: CommunicationService,
              private router: Router,
              private dialog: MatDialog) {
  }


  ngOnInit(): void {
    this.scheduleMembers = [...this.signInDialogData.daySchedule.signedMembers$.getValue()];
    this.purchaseItems = [...this.signInDialogData.purchaseItems].map( p => toPurchaseHistoryItem(p, this.today ), moment());

    this.memberIdToPurchaseItem = groupBy(this.purchaseItems, 'memberId');
    this.signInMembers = this.scheduleMembers.map<SignInMember>( scheduleMember => this.scheduleMemberToSignInMember(scheduleMember));
  }

  scheduleMemberToSignInMember( scheduleMember: ScheduleMember ): SignInMember {
    const memberPurchases: PurchaseItem[] = this.memberIdToPurchaseItem[scheduleMember.member.id];
    const activeMembership: PurchaseHistoryItem = this.getLatestPurchase(memberPurchases);
    return {scheduleMember, activeMembership };
  }

  getLatestPurchase(memberPurchases: PurchaseItem[]): PurchaseHistoryItem {
    const sortedPurchases = sortBy(memberPurchases,
     purchase => moment(purchase.startDate)
                            .add(purchase.item.expirationLength, purchase.item.expirationType).toDate().getTime(),  ['desc']);
    return sortedPurchases && sortedPurchases.length > 0 ? toPurchaseHistoryItem(first(sortedPurchases), this.today ) : null;
  }

  removeFromSchedule(signedMember: ScheduleMember) {
    remove(this.scheduleMembers, scheduleMember => scheduleMember.member.firstName == signedMember.member.firstName
      && scheduleMember.member.lastName == signedMember.member.lastName);
  }

  memberToScheduleMember(schedule: DaySchedule, member: Member, signInDate: Moment): ScheduleMember {
    return {scheduleDate: signInDate.toDate().getTime(), member, id: 0};
  }


  addMemberToSchedule(member: Member) {
    const isMemberAlreadyThere = this.scheduleMembers.findIndex(scheduleMember => scheduleMember.member.id == member.id) != -1;
    if (isMemberAlreadyThere) {
      return;
    }
    const newScheduleMember = this.memberToScheduleMember(this.signInDialogData.daySchedule, member, this.signInDialogData.signInDate);
    this.scheduleMembers.push(newScheduleMember);

    const newSignInMember = this.scheduleMemberToSignInMember(newScheduleMember);
    this.signInMembers = [newSignInMember, ...this.signInMembers];
  }

  openSellDialog(signInMember: SignInMember) {
    const memberId = signInMember.scheduleMember.member.id;
    this.dialog.open(PurchaseFormComponent,
          {data: memberId })
            .afterClosed().subscribe((purchase: PurchaseItem) => {
      if (purchase) {
          this.communicationService.savePurchase(purchase).toPromise().then((savedPurchaseItem) => {
            const purchaseHistoryItem = toPurchaseHistoryItem(savedPurchaseItem, this.today);
            this.purchaseItems.push(purchaseHistoryItem);
            this.memberIdToPurchaseItem[memberId].push(purchaseHistoryItem);
            signInMember.activeMembership = purchaseHistoryItem;
            this.communicationService.newPurchase.next(savedPurchaseItem);
          });
      }
    });

  }
}

