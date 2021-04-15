import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommunicationService} from '@shared/communication.service';
import {Package} from '../../../models/package';
import {BehaviorSubject, Observable, of, Subscription} from 'rxjs';
import {concatMap, flatMap, last, map, mergeMap, reduce, scan, take, takeLast, toArray} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {SalesDialogComponent} from './sales-dialog/sales-dialog.component';
import {MatTableDataSource} from '@angular/material/table';
import {ClassModel} from '../../../classes/class.model';
import {MatPaginator} from '@angular/material/paginator';


interface ExpandablePackage extends Package {
  isExpandable: boolean;
  isExpanded: boolean;
}

@Component({
  selector: 'sales-settings',
  templateUrl: './sales-settings.component.html',
  styleUrls: ['./sales-settings.component.scss']
})
export class SalesSettingsComponent implements OnInit, AfterViewInit, OnDestroy{
  columns = ['name', 'items', 'edit', 'delete'];
  dataSource: MatTableDataSource<Package>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  packageUpdateSub: Subscription;

  constructor(private communicationService: CommunicationService, private dialog: MatDialog) {
  }

  _newPackage(): Package {
    return {items: [], id: 0, name: ''};
  }

  openSalesDialog(packageElement?: Package) {
    const packageToSave = packageElement ? packageElement : this._newPackage();
    this.dialog.open(SalesDialogComponent, {data: packageToSave}).afterClosed().subscribe((packageToSave: Package) => {
      if (packageToSave) {
        this.communicationService.savePackage(packageToSave);
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Package>(this.communicationService.getPackages());
    this.packageUpdateSub = this.communicationService.getPackages$().subscribe(packages => this.dataSource.data = packages);
  }
}
