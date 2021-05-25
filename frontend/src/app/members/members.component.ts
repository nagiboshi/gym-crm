import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {CommunicationService} from '@shared/communication.service';
import {MembersDataSource} from './members-data-source';
import {Member} from '../models/member';
import {AddMemberDialogComponent} from '@shared/add-member-dialog/add-member-dialog.component';
import {MatTableDataSource} from '@angular/material/table';
import {DeletePromptDialogComponent} from '@shared/delete-prompt-dialog/delete-prompt-dialog.component';
import {remove} from 'lodash';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MembersComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'phoneNumber', 'gender', 'delete'];
  dataSource: MatTableDataSource<Member>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private communicationService: CommunicationService, private router: Router) {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    const size = this.paginator.pageSize;
    const offset = this.paginator.pageIndex * size;
    this.communicationService.getMembers(size, null, offset).subscribe((members) => {
      this.dataSource.data = members;
    });
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Member>();

    // (this.communicationService);
    // this.dataSource.loadMembers();
  }


  addMember() {
    const newMember = {id: 0, firstName: '', file: '', lastName: '', email: '', gender: 'Male', phoneNumber: ''};
    this.dialog.open(AddMemberDialogComponent, {data: newMember})
      .afterClosed()
      .subscribe((newMember: Member) => {
        if (newMember) {
          const formData = new FormData();
          for (let newMemberKey in newMember) {
            formData.set(newMemberKey, newMember[newMemberKey]);
          }


          this.communicationService.newMember(formData).toPromise().then((savedMember) => {
            this.dataSource.data = [savedMember, ...this.dataSource.data];
          });
        }
      });
  }

  openProfile(row: any) {
    this.router.navigateByUrl('/members/' + row.id);
  }

  onPageChange(pageEvent: PageEvent) {
    const offset = pageEvent.pageIndex * pageEvent.pageSize;
    this.communicationService.getMembers(pageEvent.pageSize, null, offset);
  }

  openMemberRemoveDialog(memberData: Member) {
    this.dialog.open(DeletePromptDialogComponent, {data: `Are you sure you want to remove ${memberData.firstName} ${memberData.lastName} from database ? `}).afterClosed().subscribe((doAction) => {
      if (doAction) {
        this.communicationService.removeMember(memberData.id).toPromise().then(() => {
          const data = [...this.dataSource.data];
          remove(data, (data) => data.id == memberData.id);
          this.dataSource.data = data;
        }).catch(e => {
          throw e;
        });
      }
    });
  }
}




