import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {DeletePromptDialogComponent} from '@shared/delete-prompt-dialog/delete-prompt-dialog.component';
import {CrudTableService, Entity} from '@shared/crud-table/crud-table.service';
import {MatDialog} from '@angular/material/dialog';
import {ComponentType} from '@angular/cdk/portal';


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

    if (!entity) {
      entity = this._newTableEntity();
    }

    if (entity.id != 0) {
      tempEntity = await this.service.get(tempEntity.id);
    }

    this.dialog.open(this.crudDialog, {data: tempEntity, minWidth: '50vw'}).afterClosed().subscribe((entity: E) => {
      if (entity) {
        this.service.save(entity).then((savedEntity) => {
          const entities = this.dataSource.data;
          this.dataSource.data = [savedEntity, ...entities];
        });
      }
    });
  }

  init(): void {
    this.dataSource = new MatTableDataSource<E>([]);
    this.service.getPaged().subscribe( response => {
      this.dataSource.data = response.data;
      this.paginator.length = response.total;
    });
  }

  openDeletePromptDialog(entity: Entity & { name: string }) {
    this.dialog.open(DeletePromptDialogComponent, {data: `Are you sure you want to delete ${entity.name} ?`}).afterClosed().subscribe(() => {
      this.service.remove(entity.id);
    });

  }

  onChangePage(ev: PageEvent) {
    const page = ev.pageIndex + 1;
    this.service.getPaged(this.limit, page).subscribe(response => {
      this.dataSource.data = response.data;
    });
  }
}
