import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {Supplier} from '@models/supplier';
import {SupplierService} from '../supplier.service';
import {CrudTableComponent} from '@shared/crud-table/crud-table.component';
import {SuppliersCrudComponent} from '../suppliers-crud/suppliers-crud.component';
import {remove} from 'lodash';
import {Property} from '@models/property';
import {PropertyService} from '@shared/properties/property.service';

@Component({
  selector: 'supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent extends CrudTableComponent<SupplierService, Supplier, SuppliersCrudComponent> implements OnInit {
  limit = 10;
  columns = ['name', 'edit', 'delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private supplierService: SupplierService, private propertyService: PropertyService, public dialog: MatDialog) {
    super(supplierService, SuppliersCrudComponent);
  }

  ngOnInit() {
    super.init();
  }

  async openCrudDialog(entity?: Supplier) {
    let tempEntity = entity ? entity : this._newTableEntity();

    if (tempEntity.id != 0) {
      tempEntity = await this.supplierService.getFullEntity(tempEntity.id);
    }
    this.dialog.open(SuppliersCrudComponent, {
      data: tempEntity,
      minWidth: '50vw'
    }).afterClosed().subscribe((supplierAndPropertiesToRemove: [Supplier, Property[]]) => {
      if (supplierAndPropertiesToRemove) {
        const [entity, propertiesToRemove] = supplierAndPropertiesToRemove;

        // Removing properties which changed

        if (propertiesToRemove) {
          Promise.all(propertiesToRemove.map(p => this.propertyService.remove(p.id)));
        }
        this.supplierService.save(entity).then((savedEntity) => {
          const entities = this.dataSource.data;
          if (entity.id != 0) {
            remove(entities, e => e.id == entity.id);
          }
          this.dataSource.data = [savedEntity, ...entities];
        }).catch((e) => {
          console.error(e);
        });
      }
    });
  }

  _newTableEntity(): Supplier {
    return {id: 0, name: '', properties: []};
  }


}
