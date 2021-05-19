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
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'phoneNumber', 'gender', 'delete'];
  dataSource: MembersDataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private communicationService: CommunicationService, private router: Router) {
  }

  ngAfterViewInit() {
  }

  ngOnInit() {
    this.dataSource = new MembersDataSource(this.communicationService);
    this.dataSource.loadMembers();
  }



  addMember() {
    const newMember = {id: 0, firstName: '', file: '', lastName: '', email: '', gender: 'Male', phoneNumber: ''};
    this.dialog.open(AddMemberDialogComponent, {data: newMember})
      .afterClosed()
      .subscribe((newMember: Member) => {
        console.log('new member' ,newMember);
        if ( newMember ) {
          const formData = new FormData();
          for (let newMemberKey in newMember) {
            formData.set(newMemberKey, newMember[newMemberKey])
          }


          this.communicationService.newMember(formData).toPromise().then((savedMember) => {
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



