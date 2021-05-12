import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {DateRange} from '@angular/material/datepicker';
import {Moment} from 'moment';

@Injectable({providedIn: 'root'})
export class SelectionStrategyEventEmitter <D>{
  strategyChanged$: BehaviorSubject<string>;
  selectMonth: Subject<any>;
  selectMonth$: Observable<any>;
  constructor() {
    this.strategyChanged$ = new BehaviorSubject<string>('week');
    this.selectMonth = new Subject();
    this.selectMonth$ = this.selectMonth.asObservable();
  }
}
