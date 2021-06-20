import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {DeletePromptDialogComponent} from '@shared/delete-prompt-dialog/delete-prompt-dialog.component';
import {User} from '@models/user';
import {UserService} from '@shared/user.service';
import {UserMergeDialogComponent} from './user-merge-dialog/user-merge-dialog.component';
import {HelpersService} from '@shared/helpers.service';
import {Subscription} from 'rxjs';


@Component({
  selector: 'user-settings',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {
  columns = ['photoLink',  'username', 'firstName', 'lastName', 'phoneNumber', 'role', 'branch', 'edit', 'delete'];
  dataSource: MatTableDataSource<User>;
  usersSub: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private userService: UserService, private dialog: MatDialog, private helpers: HelpersService) {
  }

  ngOnInit(): void {
    this.userService.getAll().toPromise();
    this.dataSource = new MatTableDataSource<User>();
    this.usersSub = this.userService.users$.subscribe( users => this.dataSource.data = users );
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
  }

  _newUser(): User {
    return {id: 0, firstName: '', lastName: '', phoneNumber: '', email: '', password: '',username:'', branches: [], role: ''};
  }

  addNew() {
    this.showMergeDialog();
  }

  showMergeDialog(user?: User) {
    user = user ?? this._newUser();
    this.dialog.open(UserMergeDialogComponent, {data: user}).afterClosed().subscribe((userToCreate) => {
      if (userToCreate) {
        const formData = this.helpers.toFormData(userToCreate);
          this.userService.addUser(formData).toPromise();
      }
    });
  }

  remove(user: User) {
    this.dialog.open(DeletePromptDialogComponent, {data: `Are you sure you want to delete user ${user.firstName}`}).afterClosed().subscribe((doAction) => {
      if (doAction) {
        this.userService.delete(user.id.toString());
      }
    });

  }

  edit(user: User) {
    this.showMergeDialog(user);
  }

}
