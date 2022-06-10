import {Component} from '@angular/core';
import {Report, ReportsService} from '../reports.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {


  constructor(public reportsService: ReportsService, private dialog: MatDialog) {

  }


  showReport(report: Report) {
    if( !report.dialog && report.func ) {
      report.func();
      return;
    }

    if( report.dialog ) {
      this.dialog.open(report.dialog).afterClosed().subscribe((data) => report.func(data));
    }
  }
}
