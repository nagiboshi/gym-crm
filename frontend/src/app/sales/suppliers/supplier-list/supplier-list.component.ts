import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {Supplier} from '@models/supplier';
import {SupplierService} from '../supplier.service';
import {CrudTableComponent} from '@shared/crud-table/crud-table.component';
import {SuppliersCrudComponent} from '../suppliers-crud/suppliers-crud.component';

@Component({
  selector: 'supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent extends CrudTableComponent<SupplierService, Supplier, SuppliersCrudComponent> implements OnInit {
  limit = 10;
  columns = ['name', 'edit', 'delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private supplierService: SupplierService, public dialog: MatDialog) {
    super(supplierService, SuppliersCrudComponent);
  }

  ngOnInit() {
    super.init();
  }


  _newTableEntity(): Supplier {
    return {id: 0, name: '', properties: []};
  }


}
