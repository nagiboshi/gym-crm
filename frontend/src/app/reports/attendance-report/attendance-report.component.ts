import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Moment} from 'moment';
import {Member} from '@models/member';
import {ClassModel} from '../../classes/class.model';
import {ClassesService} from '../../classes/classes.service';
import * as moment from 'moment';
import {remove} from 'lodash';
import {Observable, Subject} from 'rxjs';
import {AttendanceFilter, ReportsService} from '../reports.service';
import {HelpersService} from '@shared/helpers.service';
import {MatDialogRef} from '@angular/material/dialog';
import {ReportDialog} from '../report-dialog';



@Component({
  selector: 'attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.scss']
})
export class AttendanceReportComponent extends ReportDialog implements OnInit {
  form: FormGroup;
  maxSelectionDate: Moment;
  classes: ClassModel[];
  clearTimeRange: Subject<void>;
  clearTimeRange$: Observable<void>;
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AttendanceReportComponent>, private helpers: HelpersService, private reportService: ReportsService, private classesService: ClassesService) {
    super();
  }

  generateAttendanceReport() {
    const attendanceClassIds = this.form.value.attendedClassIds;
    const fromDate = (this.form.value.from as Moment).toDate();
    const toDate = (this.form.value.until as Moment ).toDate();
    const startTime = this.form.value.startTime;
    const endTime = this.form.value.endTime;
    const members: Member[] = this.form.value.members;
    const memberIds = members.map( m => m.id);
    const attendanceFilter: AttendanceFilter = {attendanceClassIds, memberIds, fromDate, toDate, startTime, endTime};
    this.dialogRef.close(attendanceFilter);
  }

  ngOnInit(): void {
    const today: Moment = moment();
    const from = today.startOf('month').clone();
    const until = today.endOf('month').clone();
    this.clearTimeRange = new Subject();
    this.clearTimeRange$ = this.clearTimeRange.asObservable();
    this.classes = this.classesService.getClasses();
    this.form = this.fb.group({
      from: [from, [Validators.required, ]],
      until: [until, [Validators.required]],
      attendedClassIds: [],
      startTime: [],
      endTime: [],
      members: [[]]
    })
  }

  setStartTime(startTime: number) {
    this.form.patchValue({startTime: startTime});
  }

  setEndTime(endTime: number) {
    this.form.patchValue({endTime: endTime});
  }

  addMemberFilter(member: Member) {
    const members: Member[] = this.form.value.members;
    const foundMember=  members.find(m => m.id == member.id);
    if( !foundMember ) {
      this.form.patchValue({members: [member, ...this.form.value.members]} );
    }
  }

  removeMember(member: Member) {
    const members: Member[] = this.form.value.members;
    remove(members, (m => m.id == member.id))
      this.form.patchValue({members: members});
  }

  clearStartEndTimeSelection($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.clearTimeRange.next();
  }
}
