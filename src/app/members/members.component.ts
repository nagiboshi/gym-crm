import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {AddMemberDialogComponent} from './add-member-dialog/add-member-dialog.component';
import {Router} from '@angular/router';
import {CommunicationService} from '../shared/communication.service';
import {MembersDataSource} from './members-data-source';
import {Member} from '../models/member.model';


@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MembersComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'phoneNumber', 'gender', 'edit', 'delete'];
  dataSource: MembersDataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private memberService: CommunicationService, private router: Router) {
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.dataSource = new MembersDataSource(this.memberService);
    this.dataSource.loadMembers();
  }

  applyFilter(event: Event) {

    // TODO:: Add time debouncing
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.loadMembers(filterValue);
  }

  addMember() {
    const newUser = {id: 0, firstName: '', lastName: '', email: '', gender: 'Male', phoneNumber: ''};
    this.dialog.open(AddMemberDialogComponent, {data: newUser})
      .afterClosed()
      .subscribe((newMember: Member) => {
        this.memberService.newMember(newMember).toPromise().then((savedMember) => {
          const memberSubj = this.dataSource.membersSubject;
          memberSubj.next([...memberSubj.getValue(), savedMember]);
        });
      });
  }

  openProfile(row: any) {
    this.router.navigateByUrl('/member/' + row.id);
  }
}

/** Builds and returns a new User. */



