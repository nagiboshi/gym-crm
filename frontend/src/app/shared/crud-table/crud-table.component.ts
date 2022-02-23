import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {DeletePromptDialogComponent} from '@shared/delete-prompt-dialog/delete-prompt-dialog.component';
import {CrudTableService, Entity} from '@shared/crud-table/crud-table.service';
import {MatDialog} from '@angular/material/dialog';
import {ComponentType} from '@angular/cdk/portal';
import {remove} from 'lodash';
import {RequestQueryBuilder} from '@nestjsx/crud-request';

export abstract class CrudTableComponent<S extends CrudTableService<E>, E extends Entity, C> {
  limit = 10;
  dataSource: MatTableDataSource<E>;
  abstract paginator: MatPaginator;
  abstract dialog: MatDialog;
  abstract columns: string[];
  constructor(private service: S, private crudDialog: ComponentType<C>) {
  }

  abstract _newTableEntity(): E;

  async openCrudDialog(entity?: E) {
    let tempEntity = entity ? entity : this._newTableEntity();

    if (tempEntity.id != 0) {
      tempEntity = await this.service.getFullEntity(tempEntity.id);
    }
    this.dialog.open(this.crudDialog, {data: tempEntity, minHeight: '80%', minWidth: '50vw'}).afterClosed().subscribe((entity: E) => {
      if (entity) {
        this.service.save(entity).then((savedEntity) => {
          const entities = this.dataSource.data;
          remove(entities, e => e.id == savedEntity.id);
          this.dataSource.data = [savedEntity, ...entities];
        }).catch((e) => {
          console.error(e);
        });
      }
    });
  }

  init(limit = 10, page = 0, queryBuilder?: RequestQueryBuilder): void {
    this.dataSource = new MatTableDataSource<E>([]);
    this.service.getPaged(limit, page, queryBuilder).subscribe( response => {
      this.dataSource.data = response.data;
      this.paginator.length = response.total;
    });
  }

  openDeletePromptDialog(entity: Entity & { name: string }) {
    this.dialog.open(DeletePromptDialogComponent, {data: `Are you sure you want to delete ${entity.name || 'item'} ?`}).afterClosed().subscribe((ack) => {
      if( ack ) {
        this.service.remove(entity.id).then(() => {
          const data = this.dataSource.data;
          remove(data, (d) => d.id == entity.id);
          this.dataSource.data = [...data];
        });
      }
    });

  }

  onChangePage(ev: PageEvent) {
    const page = ev.pageIndex + 1;
    this.service.getPaged(this.limit, page).subscribe(response => {
      this.dataSource.data = response.data;
    });
  }
}
