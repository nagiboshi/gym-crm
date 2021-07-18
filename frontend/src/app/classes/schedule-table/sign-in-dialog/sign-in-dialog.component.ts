import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {CommunicationService, DaySchedule} from '@shared/communication.service';
import {Member} from '@models/member';
import {ScheduleMember} from '@models/schedule-member';
import {Moment} from 'moment';
import * as _moment from 'moment';
import {remove,  sortBy, Dictionary, first} from 'lodash';
import {MembershipPurchaseHistoryItem, MembershipPurchaseModel} from '@models/purchase';
import {PurchaseFormComponent} from '../../../sales/purchase-form/purchase-form.component';
import {Router} from '@angular/router';
import {map, tap} from 'rxjs/operators';
import {SalesService} from '../../../sales/sales.service';
import {MatTableDataSource} from '@angular/material/table';

export interface SignInDialogData {
  daySchedule: DaySchedule;
  signInDate: Moment;
}

export interface SignInMember {
  member: Member;
  // scheduleMember: ScheduleMember;
  activeMembership: MembershipPurchaseHistoryItem;
}

const moment = _moment;

@Component({
  selector: 'app-sign-in-dialog',
  templateUrl: './sign-in-dialog.component.html',
  styleUrls: ['./sign-in-dialog.component.scss']
})
export class SignInDialogComponent implements OnInit {
  purchaseItems: MembershipPurchaseHistoryItem[];
  // memberIdToPurchaseItem: Dictionary<PurchaseHistoryItem[]>;
  today = moment();
  displayedColumns: string[] = ['fullName', 'package', 'expiryDate', 'sell' ];
  dataSource: MatTableDataSource<SignInMember> = new MatTableDataSource<SignInMember>();
  constructor(@Inject(MAT_DIALOG_DATA) public signInDialogData: SignInDialogData,
              private communicationService: CommunicationService,
              private router: Router,
              private salesService: SalesService,
              private dialog: MatDialog) {
  }


  ngOnInit(): void {
    const scheduleMembers = this.signInDialogData.daySchedule.signedMembers$.getValue();
    const memberIds = scheduleMembers.filter( sm => !sm.member ).map( sm => sm.memberId);

    // this.schedu

    this.communicationService.getMembersByIds(memberIds).pipe(map<Member[], SignInMember[]>( (members) => {
      return members.map(  m => {
      console.log(m);
      return {
        member: m,
        activeMembership: m.membershipPurchases.length > 0 ? this.salesService.toPurchaseHistoryItem(first(m.membershipPurchases), this.today) : null
      }})
  }
    )).toPromise().then(members =>  this.dataSource.data = members );
  }

  removeFromSchedule(signedMember: ScheduleMember) {
    const scheduleMembers = this.dataSource.data;
    remove(scheduleMembers, scheduleMember => scheduleMember.member.firstName == signedMember.member.firstName
      && scheduleMember.member.lastName == signedMember.member.lastName);
  }

  addMemberToSchedule(member: Member) {
    // debugger;
    const scheduleMembers = this.dataSource.data;
    const isMemberAlreadyThere = scheduleMembers.findIndex(scheduleMember => scheduleMember.member.id == member.id) != -1;
    if (isMemberAlreadyThere) {
      return;
    }

    this.communicationService.getMemberWithPurchases(member.id, false, true, false ).toPromise().then((memberWithPurchases) => {
      const activeMembership = memberWithPurchases.membershipPurchases?.length > 0 ?  this.salesService.toPurchaseHistoryItem(first(memberWithPurchases.membershipPurchases), this.today): null;
      scheduleMembers.push({member: memberWithPurchases,
        activeMembership: activeMembership});
      this.dataSource.data = [...scheduleMembers];
    });
  }

  openSellDialog(signInMember: SignInMember) {
    const memberId = signInMember.member.id;
    this.dialog.open(PurchaseFormComponent,
          {data: signInMember.member })
            .afterClosed().subscribe((purchase: MembershipPurchaseModel) => {
      if (purchase) {
          // const purchaseModel = toPurchaseItemModel(purchase);
          this.salesService.savePurchase(purchase)
                                   .pipe( map( p =>  this.salesService.toPurchaseHistoryItem(p, this.today),
                                        tap((historyItem: MembershipPurchaseHistoryItem) => {
                                          this.purchaseItems.push(historyItem);
                                        //  this.memberIdToPurchaseItem[memberId].push(historyItem);
                                        } )))
                                   .toPromise().then((savedPurchaseItem) => {
                                  debugger;
                                     if( savedPurchaseItem ) {
                                       const scheduleMembers = this.dataSource.data;
                                       // scheduleMembers.
                                       const scheduleMember = scheduleMembers.find(scheduleMember => scheduleMember.member.id == memberId);
                                       if (scheduleMember.member) {
                                         scheduleMember.member.membershipPurchases.push(savedPurchaseItem);
                                         scheduleMember.activeMembership = savedPurchaseItem; // this.salesService.toPurchaseHistoryItem(savedPurchaseItem, this.today);
                                       }
                                       this.dataSource.data = [...scheduleMembers];
                                     }
          });
      }
    });

  }
}

