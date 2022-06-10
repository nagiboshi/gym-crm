import {AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {Member} from '@models/member';
import {AddMemberDialogComponent} from '@shared/add-member-dialog/add-member-dialog.component';
import {MatTableDataSource} from '@angular/material/table';
import {DeletePromptDialogComponent} from '@shared/delete-prompt-dialog/delete-prompt-dialog.component';
import {remove} from 'lodash';
import {Subscription} from 'rxjs';
import {MembersService} from './members.service';
import * as _moment from 'moment';
import {ReportsService} from '../reports/reports.service';
import {HelpersService} from '@shared/helpers.service';
import {MatSelectChange} from '@angular/material/select';


const moment = _moment;

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MembersComponent implements AfterViewInit, OnInit, OnDestroy {
  displayedColumns: string[] = ['avatar', 'firstName', 'lastName', 'type', 'email', 'phoneNumber', 'gender', 'delete'];
  dataSource: MatTableDataSource<Member>;
  memberCreatedSub: Subscription;
  memberType: 'local' | 'shared' = 'shared';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private helpers: HelpersService, private reportsService: ReportsService, public dialog: MatDialog, private membersService: MembersService, private router: Router) {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    const size = this.paginator.pageSize;
    const offset = this.paginator.pageIndex * size;
    this.fetchMembers(size, null, offset, this.memberType);
  }

  fetchMembers(size, filterNameLastNameOrPhone, offset, accountType: 'local' | 'shared') {
    this.membersService.getMembers(size, null, offset, accountType).subscribe((membersPage) => {
      this.dataSource.data = membersPage.data;
    });
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Member>();
    this.memberCreatedSub = this.membersService.memberCreated$.subscribe((createdMember) => {
      this.dataSource.data = [createdMember, ...this.dataSource.data];
    });
  }

  addMember() {
    const newMember: Partial<Member> = {
      id: 0,
      firstName: '',
      photoLink: '',
      dob: null,
      lastName: '',
      email: '',
      gender: 'Male',
      phoneNumber: '',
      type: 'shared'
    };


    this.dialog.open(AddMemberDialogComponent, {data: newMember})
      .afterClosed()
      .subscribe((newMember: Member) => {
        if (newMember) {
          this.membersService.saveMember(newMember).toPromise().then((savedMember) => {
            this.membersService.memberCreated.next(savedMember);
          });
        }
      });
  }

  openProfile(row: any) {
    this.router.navigateByUrl('/members/profile/' + row.id);
  }

  onPageChange(pageEvent: PageEvent) {
    const offset = pageEvent.pageIndex * pageEvent.pageSize;
    this.membersService.getMembers(pageEvent.pageSize, null, offset, this.memberType);
  }

  openMemberRemoveDialog(memberData: Member) {
    this.dialog.open(DeletePromptDialogComponent, {data: `Are you sure you want to remove ${memberData.firstName} ${memberData.lastName} from database ? `}).afterClosed().subscribe((doAction) => {
      if (doAction) {
        this.membersService.removeMember(memberData.id).toPromise().then(() => {
          const data = [...this.dataSource.data];
          remove(data, (data) => data.id == memberData.id);
          this.dataSource.data = data;
        }).catch(e => {
          throw e;
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.memberCreatedSub.unsubscribe();
  }

  makeReport() {
    const report = this.reportsService.reportsSub.getValue().find(r => r.name == 'Members Report');
    this.dialog.open(report.dialog).afterClosed().subscribe(f => report.func(f));
  }

  filterMembers(change: MatSelectChange) {
    const size = this.paginator.pageSize;
    const offset = this.paginator.pageIndex * size;
    this.fetchMembers(size, null, offset, this.memberType);
  }
}




