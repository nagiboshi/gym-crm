import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {DaySchedule, ScheduleWeekDay} from '@shared/communication.service';
import {Member} from '@models/member';
import {ScheduleMember} from '@models/schedule-member';
import * as _moment from 'moment';
import {Moment} from 'moment';
import {remove} from 'lodash';
import {ExtendedMembershipPurchaseModel, MembershipPurchaseModel} from '@models/membership-purchase';
import {Router} from '@angular/router';
import {map, tap} from 'rxjs/operators';
import {SalesService} from '../../../sales/sales.service';
import {MatTableDataSource} from '@angular/material/table';
import {ServicePurchaseFormComponent} from '../../../sales/membership/service-purchase-form/service-purchase-form.component';
import {MembersService} from '../../../members/members.service';
import {SignedMembersPipe} from '../../signed-members.pipe';
import {HelpersService} from '@shared/helpers.service';
import {QueryJoin} from '@nestjsx/crud-request';
import {MatPaginator} from '@angular/material/paginator';

export interface SignInDialogData {
  daySchedule: DaySchedule;
  signInDate: Moment;
  scheduleWeekDay: ScheduleWeekDay;
}

export interface SignInMember {
  member: Member;
  activeMembership: ExtendedMembershipPurchaseModel;
}

const moment = _moment;

@Component({
  selector: 'app-sign-in-dialog',
  templateUrl: './sign-in-dialog.component.html',
  styleUrls: ['./sign-in-dialog.component.scss']
})
export class SignInDialogComponent implements OnInit {
  purchaseItems: ExtendedMembershipPurchaseModel[];
  displayedColumns: string[] = ['fullName', 'package', 'expiryDate', 'sell'];
  dataSource: MatTableDataSource<SignInMember> = new MatTableDataSource<SignInMember>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(@Inject(MAT_DIALOG_DATA) public signInDialogData: SignInDialogData,
              private communicationService: MembersService,
              private router: Router,
              private helpers: HelpersService,
              private salesService: SalesService,
              private signedMembersPipe: SignedMembersPipe,
              private dialog: MatDialog) {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    const scheduleMembers = this.signedMembersPipe.transform(this.signInDialogData.daySchedule.signedMembers$, this.signInDialogData.scheduleWeekDay);
    const memberIds = scheduleMembers.filter(sm => !sm.member).map(sm => sm.memberId);
    const memberJoinFields: QueryJoin[] = [{field: 'activeMembership'}, {field: 'activeMembership.membership'}, {field: 'freeze'}, {field: 'activeMembership.payments'}];
    this.communicationService.getMembersByIds(memberIds, memberJoinFields).pipe(map<Member[], SignInMember[]>((members) => {
        return members.map(m => {
          return {
            member: m,
            activeMembership: m.activeMembership ? this.helpers.extendMembership(m.activeMembership) : null
          };
        });
      }
    )).toPromise().then(members => this.dataSource.data = members);
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
    this.communicationService.getMemberWithMembershipInfo(member.id).toPromise().then((m) => {
      const activeMembership = m.activeMembership ? this.helpers.extendMembership(m.activeMembership) : null;
      scheduleMembers.push({
        member: m,
        activeMembership: activeMembership
      });
      this.dataSource.data = [...scheduleMembers];
    });
  }

  openSellDialog(signInMember: SignInMember) {
    const memberId = signInMember.member.id;
    this.dialog.open(ServicePurchaseFormComponent,
      {data: signInMember.member})
      .afterClosed().subscribe((purchase: MembershipPurchaseModel) => {
      if (purchase) {
        // const purchaseModel = toPurchaseItemModel(purchase);
        this.salesService.savePurchase(purchase)
          .pipe(map(p => this.helpers.extendMembership(p),
            tap((historyItem: ExtendedMembershipPurchaseModel) => {
              this.purchaseItems.push(historyItem);
              //  this.memberIdToPurchaseItem[memberId].push(historyItem);
            })))
          .toPromise().then((savedPurchaseItem) => {
          if (savedPurchaseItem) {
            const scheduleMembers = this.dataSource.data;
            // scheduleMembers.
            const scheduleMember = scheduleMembers.find(scheduleMember => scheduleMember.member.id == memberId);
            if (scheduleMember.member) {
              scheduleMember.member.membershipPurchases.push(savedPurchaseItem);
              scheduleMember.activeMembership = this.helpers.extendMembership(savedPurchaseItem);
            }
            this.dataSource.data = [...scheduleMembers];
          }
        });
      }
    });

  }
}

