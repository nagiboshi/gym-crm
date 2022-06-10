import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as _moment from 'moment';
import {ReportsService} from '../reports.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ReportDialog} from '../report-dialog';

const moment = _moment;

@Component({
  selector: 'sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss']
})
export class SalesReportComponent extends ReportDialog implements OnInit {
  formGroup: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) private data, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      fromDate: [moment(moment.now()).startOf('month'), Validators.required],
      toDate: [moment(moment.now()), Validators.required],
      type: [this.data?.type??""]
    });
  }

}
