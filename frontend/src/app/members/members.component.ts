import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {CommunicationService} from '@shared/communication.service';
import {MembersDataSource} from './members-data-source';
import {Member} from '../models/member';
import {AddMemberDialogComponent} from '@shared/add-member-dialog/add-member-dialog.component';


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
  }

  ngOnInit() {
    this.dataSource = new MembersDataSource(this.memberService);
    this.dataSource.loadMembers();
  }



  addMember() {
    const newUser = {id: 0, firstName: '', lastName: '', email: '', gender: 'Male', phoneNumber: ''};
    this.dialog.open(AddMemberDialogComponent, {data: newUser})
      .afterClosed()
      .subscribe((newMember: Member) => {
        if ( newMember ) {
          this.memberService.newMember(newMember).toPromise().then((savedMember) => {
            const memberSubj = this.dataSource.membersSubject;
            memberSubj.next([...memberSubj.getValue(), savedMember]);
          });
        }
      });
  }

  openProfile(row: any) {
    this.router.navigateByUrl('/members/' + row.id);
  }
}

/** Builds and returns a new User. */



