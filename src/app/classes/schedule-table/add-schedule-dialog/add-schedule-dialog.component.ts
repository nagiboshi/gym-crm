import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';
import {CommunicationService} from '@shared/communication.service';
import {ClassModel} from '../../class.model';
import {BehaviorSubject} from 'rxjs';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {Moment} from 'moment';
import {MAT_DATE_FORMATS} from '@angular/material/core';

const moment =  _moment;
export interface PrimalClassSchedule {
  days: number[];
  selectedClass: ClassModel;
  startTime: number;
  endTime: number;
  capacity: number;
  scheduleFrom: number;
  scheduleUntil: number;
}

@Component({
  selector: 'app-add-schedule-dialog',
  templateUrl: './add-schedule-dialog.component.html',
  styleUrls: ['./add-schedule-dialog.component.scss'],
})
export class AddScheduleDialogComponent implements OnInit {
  existingClasses: ClassModel[];
  selectedClass: ClassModel;
  dayMappings: { [day: number]: string };
  selectedDays: BehaviorSubject<number[]> = new BehaviorSubject([]);
  startTime = -1;
  endTime = -1;
  capacity = 10;
  scheduleUntilDate: Moment;
  scheduleFromDate: Moment;

  // selectedDays: DaySelection[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public day: string, private fb: FormBuilder, private communicationService: CommunicationService) {
  }

  ngOnInit(): void {

    // Setting first day of next month as a default end date of schedule.
    const scheduleUntilDateMoment = moment();
    scheduleUntilDateMoment.add(1, 'month');
    scheduleUntilDateMoment.subtract(new Date().getDay(), 'days');
    this.scheduleFromDate = moment();
    this.scheduleUntilDate = scheduleUntilDateMoment;
    this.dayMappings = this.communicationService.getDayMappings();
    this.existingClasses = this.communicationService.getClasses();
    if (this.day) {
      this.selectedDays.next([...this.selectedDays.getValue(), parseInt(this.day, 10)]);
    }
  }

  isDaySelected(day: string): boolean {
    return this.selectedDays.getValue().findIndex(d => d == parseInt(day, 10)) != -1;
  }

  toggleDay(day: string) {
    const dayNum = parseInt(day, 10);
    const dayIndex = this.selectedDays.getValue().findIndex(d => d == dayNum);
    if (dayIndex == -1) {
      this.selectedDays.next([...this.selectedDays.getValue(), dayNum]);
      // push(dayNum);
    } else {
      const selectedDays = [...this.selectedDays.getValue()];
      selectedDays.splice(dayIndex, 1);
      this.selectedDays.next(selectedDays);
    }
  }


  isValid() {
    return this.selectedDays.getValue().length > 0 && this.startTime && this.endTime && this.selectedClass && this.capacity > 0;
  }

  setStartTime(startTime: number) {
    this.startTime = startTime;
  }

  setEndTime(endTime: number) {
    this.endTime = endTime;
  }
}
