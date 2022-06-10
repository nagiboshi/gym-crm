import {Component, ViewChild} from '@angular/core';
import {Branch} from '@models/branch';
import {CrudTableComponent} from '@shared/crud-table/crud-table.component';
import {PurchaseVoucherCrudDialogComponent} from '../../../sales/purchase-vouchers/purchase-voucher-crud-dialog/purchase-voucher-crud-dialog.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {BranchService} from '../branch.service';
import {AddBranchDialogComponent} from './add-branch-dialog/add-branch-dialog.component';

@Component({
  selector: 'branches-list',
  templateUrl: './branches-list.component.html',
  styleUrls: ['./branches-list.component.scss']
})
export class BranchesListComponent extends CrudTableComponent<BranchService, Branch, AddBranchDialogComponent> {
  limit = 10;
  columns = ['name', 'edit', 'delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog, private branchService: BranchService) {
    super(branchService, AddBranchDialogComponent);
  }

  ngOnInit() {
    super.init();
  }

  _newTableEntity(): Branch {
    return {id: 0, name: ''};
  }


}
