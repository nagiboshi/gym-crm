import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReportsService} from '../reports.service';
import {MatDialogRef} from '@angular/material/dialog';
import {ReportDialog} from '../report-dialog';

export interface MemberReportFilter {
  fromDate: Date;
  toDate: Date;
  activeMembersOnly: boolean;
}

@Component({
  selector: 'members-report',
  templateUrl: './members-report.component.html',
  styleUrls: ['./members-report.component.scss']
})
export class MembersReportComponent extends ReportDialog implements OnInit {
  formGroup: FormGroup;
  constructor(private fb: FormBuilder, private reportsService: ReportsService, private dialogRef: MatDialogRef<MembersReportComponent>) {
    super();
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      fromDate: [null],
      toDate: [null],
      activeMembersOnly: [false]
    })

  }

  clearDate() {
    this.formGroup.patchValue({fromDate: null, toDate: null})
  }

  makeReport() {
    const filter: MemberReportFilter = this.formGroup.value;
    this.dialogRef.close(filter);
  }
}
