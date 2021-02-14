import {Component, Injectable} from '@angular/core';
import {DateAdapter} from '@angular/material/core';
import {
  MatDateRangeSelectionStrategy,
  DateRange,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
} from '@angular/material/datepicker';
import {SelectionStrategyEventEmitter} from './selection-strategy.event-emitter';
import {Moment} from 'moment';

@Injectable()
export class DateSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {
  constructor(private _dateAdapter: DateAdapter<D>, private selectionStrategyEventEmitter: SelectionStrategyEventEmitter<D>) {
  }

  selectionFinished(date: D | null): DateRange<D> {
    const dateRange = this._createRange(date, this.selectionStrategyEventEmitter.strategyChanged$.getValue());
    return dateRange;
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createRange(activeDate, this.selectionStrategyEventEmitter.strategyChanged$.getValue());
  }

  private _createRange(date: D | null, selectionStrategy: string): DateRange<D> {
    if (date) {
      let start;
      let end;
      const dateMoment = date as unknown as Moment;

      if ( selectionStrategy == 'week' ) {
        start = dateMoment.clone().startOf('week');
        end =  dateMoment.clone().endOf('week');
      } else {
        start = dateMoment.clone().startOf('month');
        end = dateMoment.clone().endOf('month');
      }
      return new DateRange<D>(start, end);
    }

    return new DateRange<D>(null, null);
  }
}
