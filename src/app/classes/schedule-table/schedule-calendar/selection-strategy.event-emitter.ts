import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {DateRange} from '@angular/material/datepicker';
import {Moment} from 'moment';

@Injectable({providedIn: 'root'})
export class SelectionStrategyEventEmitter <D>{
  strategyChanged$: BehaviorSubject<string>;

  constructor() {
    this.strategyChanged$ = new BehaviorSubject<string>('week');
  }
}
