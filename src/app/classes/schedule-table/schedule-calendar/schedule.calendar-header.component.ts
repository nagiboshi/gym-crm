import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject, OnDestroy, OnInit
} from '@angular/core';
import {MatCalendar} from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_FORMATS, MatDateFormats} from '@angular/material/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Moment} from 'moment';
import * as _moment from 'moment';
import {range} from 'lodash';
import {SelectionStrategyEventEmitter} from './selection-strategy.event-emitter';

const moment = _moment;

/** Custom header component for datepicker. */
@Component({
  selector: 'schedule-calendar-header',
  styles: [`
    .schedule-calendar-header {
      display: flex;
      align-items: center;
      padding: 0.5em;
    }

    .schedule-calendar-header{
      min-width: 360px;
    }

    .select-full-month{
      cursor: pointer;
      color: rgba(0, 117, 169, 0.8);
    }

    .year-selection {
        width: 80px;
    }
  `],
  template: `
    <div class="schedule-calendar-header">
      <mat-form-field appearance="none">
        <mat-select class="year-selection" (valueChange)="yearChanged($event)" [value]="selectedYear" placeholder="Year">
          <mat-option [value]="year" *ngFor="let year of years">{{year}}</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="none">
        <mat-select [value]="selectedMonth" (valueChange)="monthChanged($event)" placeholder="Month">
          <mat-option [value]="month" *ngFor="let month of months">{{month}}</mat-option>
        </mat-select>
        <mat-hint (click)="selectMonth()" class="select-full-month">Select all month</mat-hint>
      </mat-form-field>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleCalendarHeaderComponent<D> implements OnDestroy {
  private _destroyed = new Subject<void>();
  years;
  months;
  selectedYear; //  = this.currentDate.year();
  selectedMonth;
  selectionStrategy = 'week';

  constructor(
    private _calendar: MatCalendar<D>, private _dateAdapter: DateAdapter<D>,
    private selectionStrategyEventEmitter: SelectionStrategyEventEmitter<D>,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats, cdr: ChangeDetectorRef) {
    _calendar.stateChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => {
        cdr.markForCheck();
        // console.log(this._calendar.monthView._matCalendarBody.rows.length);
      });
    const activeDate = this._calendar.activeDate as unknown as Moment;
    this.years = range(activeDate.clone().subtract(10, 'year').year(), activeDate.clone().add(10, 'year').year());
    this.months = moment.months();
    this.selectedYear = activeDate.year();
    this.selectedMonth = this.months[activeDate.month()];
  }

  yearChanged(newYear: number) {
    const activeDate = (this._calendar.activeDate as unknown as Moment).clone();
    activeDate.year(newYear);
    this._calendar.activeDate = activeDate as any;
  }

  monthChanged(newMonth: string) {
    const activeDate = (this._calendar.activeDate as unknown as Moment).clone();
    activeDate.month(newMonth);
    this._calendar.activeDate = activeDate as any;
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  get periodLabel() {
    return this._dateAdapter
      .format(this._calendar.activeDate, this._dateFormats.display.monthYearLabel)
      .toLocaleUpperCase();
  }

  selectMonth() {
    this.selectionStrategyEventEmitter.selectMonth.next();
  }
}
