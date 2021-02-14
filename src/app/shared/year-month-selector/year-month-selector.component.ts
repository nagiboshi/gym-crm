import {MAT_DATE_FORMATS} from '@angular/material/core';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {Moment} from 'moment';

const moment =  _moment;

export const YEAR_MONTH_FORMAT = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'year-month-selector',
  templateUrl: './year-month-selector.component.html',
  styleUrls: ['./year-month-selector.component.scss'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: YEAR_MONTH_FORMAT},
  ],
})
export class YearMonthSelectorComponent  implements OnInit{
  @Output()
  selectedDate = new EventEmitter();
  @Input()
  initialDate: number;
  date: FormControl = new FormControl();

  ngOnInit() {
    if ( !this.initialDate ) {
      this.date.patchValue(moment());
    } else {
      this.date.patchValue(moment(this.initialDate));
    }
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    this.selectedDate.emit(normalizedYear.date());
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    this.selectedDate.emit(normalizedMonth.date());
    datepicker.close();
  }
}
