import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {MatSelectChange} from '@angular/material/select';
import * as _moment from 'moment';

const moment = _moment;

const MAX_VALUE = 86340000;
const MIN_VALUE = 2.16e+7;
@Component({
  selector: 'time-range-selector',
  templateUrl: './time-range-selector.component.html',
  styleUrls: ['./time-range-selector.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TimeRangeSelectorComponent implements OnInit {
  @Input() startValue: number;
  @Input() endValue: number;
  @Input() interval: number;
  @Output() startTimeChanged: EventEmitter<number> = new EventEmitter<number>();
  @Output() endTimeChanged: EventEmitter<number> = new EventEmitter<number>();
  startTimePossibleValues: Array<number> = [];
  endTimePossibleValues: Array<number> = [];
  constructor() { }

  ngOnInit(): void {
    if ( !this.startValue ) {
      this.startValue = MIN_VALUE;
    }

    if ( !this.endValue ) {
      this.endValue = MAX_VALUE;
    }

    if ( this.endValue < this.startValue ) {
      const tmp = this.endValue;
      this.endValue = this.startValue;
      this.startValue = tmp;
    }

    if ( !this.interval ) {
      this.interval = 900000;
    }

    let currentValue = this.startValue;

    while ( currentValue < this.endValue ) {
      this.startTimePossibleValues.push(currentValue);
      currentValue += this.interval;
    }

  }

  startValueChanged($event: MatSelectChange) {
      let fromTimeSelection = $event.value + this.interval;

      while ( fromTimeSelection < this.endValue ) {
        this.endTimePossibleValues.push(fromTimeSelection);
        fromTimeSelection += this.interval;
      }
      this.startTimeChanged.emit($event.value);
  }

  endValueChanged($event: MatSelectChange) {
    this.endTimeChanged.emit($event.value);
  }
}
