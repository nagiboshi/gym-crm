import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {DeletePromptDialogComponent} from '@shared/delete-prompt-dialog/delete-prompt-dialog.component';
import {TaxMergeDialogComponent} from './tax-merge-dialog/tax-merge-dialog.component';
import {Tax} from '@models/tax';
import {TaxService} from '@shared/tax.service';
import {remove} from 'lodash';

@Component({
  selector: 'tax-settings',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.scss']
})
export class TaxesComponent implements OnInit, AfterViewInit {
  columns = ['name', 'value', 'edit', 'delete'];
  dataSource: MatTableDataSource<Tax>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private taxService: TaxService, private dialog: MatDialog) {
  }

  ngOnInit(): void {

    this.dataSource = new MatTableDataSource<Tax>();
    this.dataSource.data = this.taxService.getTaxes();
  }

  _newTax(): Tax {
    return {id: 0, name: '', value: 0};
  }

  addNew() {
    this.showMergeDialog();
  }

  showMergeDialog(tax?: Tax) {
    tax = tax ?? this._newTax();
    this.dialog.open(TaxMergeDialogComponent, {data: tax}).afterClosed().subscribe(async(taxToCreate) => {
      if (taxToCreate) {
       const savedTax = await this.taxService.addTax(taxToCreate);
        this.dataSource.data = [savedTax, ...this.dataSource.data];
      }
    });
  }

  remove(tax: Tax) {
    this.dialog.open(DeletePromptDialogComponent, {data: `Are you sure you want to delete tax ${tax.name}`}).afterClosed().subscribe((doAction) => {
      if (doAction) {
        this.taxService.delete(tax.id.toString()).then(() => {
          let taxes = this.dataSource.data;
          remove(taxes, t => t.id == tax.id);
          this.dataSource.data = [...taxes];
        });
      }
    });

  }

  edit(tax: Tax) {
    this.showMergeDialog(tax);
  }

}
