import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MembershipGroup} from '@models/membership-group';
import { Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {MembershipCrudDialog} from '../membership-crud-dialog/membership-crud-dialog.component';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {DeletePromptDialogComponent} from '@shared/delete-prompt-dialog/delete-prompt-dialog.component';
import {MembershipGroupService} from '@shared/membership-group.service';

@Component({
  selector: 'membership-list',
  templateUrl: './membership-list.component.html',
  styleUrls: ['./membership-list.component.scss']
})
export class MembershipListComponent implements OnInit, AfterViewInit{
  columns = ['name', 'items', 'edit', 'delete'];
  dataSource: MatTableDataSource<MembershipGroup>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  packageUpdateSub: Subscription;

  constructor(private membershipGroupService: MembershipGroupService, private dialog: MatDialog) {
  }

  _newMembershipGroup(): MembershipGroup {
    return {memberships: [], id: 0, name: ''};
  }

  openSalesDialog(membershipGroup?: MembershipGroup) {
    const tempMembershipGroup = membershipGroup ? membershipGroup : this._newMembershipGroup();
    this.dialog.open(MembershipCrudDialog, {data: tempMembershipGroup}).afterClosed().subscribe((memberGroupToSave: MembershipGroup) => {
      if (memberGroupToSave) {
        this.membershipGroupService.saveMembershipGroup(memberGroupToSave);
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<MembershipGroup>([]);
    this.packageUpdateSub = this.membershipGroupService.getMembershipGroups$().subscribe(membershipCategories => {
      this.dataSource.data = membershipCategories;} );
  }

  openDeletePromptDialog(membershipGroup: MembershipGroup) {
    this.dialog.open(DeletePromptDialogComponent, {data: `Are you sure you want to delete ${membershipGroup.name} ?`}).afterClosed().subscribe(() => {
      this.membershipGroupService.removeMembershipGroup(membershipGroup);
    });

  }
}
