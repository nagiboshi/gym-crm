import {Component} from '@angular/core';
import {CommunicationService} from '@shared/communication.service';
import {Package} from '../../../models/package';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {concatMap, flatMap, last, map, mergeMap, reduce, scan, take, takeLast, toArray} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {SalesDialogComponent} from './sales-dialog/sales-dialog.component';


interface ExpandablePackage extends Package {
  isExpandable: boolean;
  isExpanded: boolean;
}

@Component({
  selector: 'sales-settings',
  templateUrl: './sales-settings.component.html',
  styleUrls: ['./sales-settings.component.scss']
})
export class SalesSettingsComponent {
  packages: Observable<ExpandablePackage[]>;

  constructor(private communicationService: CommunicationService, private dialog: MatDialog) {
    this.packages = this.communicationService.getPackages$()
      .pipe(
        map<Package[], ExpandablePackage[]>((p) => {
          return p.map((p) => {
            return {...p, ...{isExpandable: p.items.length > 0,
                              isExpanded: false}};
          });
        }));
  }

  expandPackage(packageElement: ExpandablePackage) {
    packageElement.isExpanded = !packageElement.isExpanded;
  }

  _newPackage(): Package {
    return {items: [], id: 0, name: ''};
  }

  openSalesDialog(packageElement?:Package) {
    const packageToSave= packageElement?packageElement: this._newPackage();
    this.dialog.open(SalesDialogComponent, {data: packageToSave}).afterClosed().subscribe((packageToSave) => {
      if( packageToSave ) {
        this.communicationService.savePackage(packageToSave);
      }
    })
  }
}
