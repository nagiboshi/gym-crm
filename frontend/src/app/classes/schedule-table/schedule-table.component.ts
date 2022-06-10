import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {ClassModel} from '../class.model';
import {ClassSchedule, CommunicationService, DaySchedule, ScheduleWeekDay} from '@shared/communication.service';
import {MatDialog} from '@angular/material/dialog';
import {AddScheduleDialogComponent, PrimalClassSchedule} from './add-schedule-dialog/add-schedule-dialog.component';
import {BehaviorSubject,  Subscription} from 'rxjs';
import {SignInDialogComponent, SignInDialogData, SignInMember} from './sign-in-dialog/sign-in-dialog.component';
import {Moment} from 'moment';
import * as _moment from 'moment';
import {
  DateRange,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER, MatCalendar,
  MatDateRangePicker
} from '@angular/material/datepicker';
import {DateSelectionStrategy} from './schedule-calendar/date-selection.strategy';
import {ScheduleCalendarHeaderComponent} from './schedule-calendar/schedule.calendar-header.component';
import {SelectionStrategyEventEmitter} from './schedule-calendar/selection-strategy.event-emitter';
import {ScheduleMember} from '@models/schedule-member';
import {ClassesService} from '../classes.service';
import {AttendanceReportComponent} from '../../reports/attendance-report/attendance-report.component';
import {ReportsService} from '../../reports/reports.service';

const moment = _moment;


@Component({
  selector: 'app-classes',
  templateUrl: './schedule-table.component.html',
  styleUrls: ['./schedule-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{provide: MAT_DATE_RANGE_SELECTION_STRATEGY, useClass: DateSelectionStrategy}, MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER]
})
export class ScheduleTableComponent implements OnInit, OnDestroy {
  classes: ClassModel[];
  scheduleWeekDays: ScheduleWeekDay[];
  today: Date = new Date();
  schedules$: BehaviorSubject<DaySchedule[]> = new BehaviorSubject<DaySchedule[]>([]);
  scheduleDate: DateRange<Moment>;
  scheduleCalendarHeader = ScheduleCalendarHeaderComponent;
  subscriptions: Subscription[] = [];
  @ViewChild(MatCalendar)
  calendar;
  sortSchedulesFunction = (a: ClassSchedule, b: ClassSchedule): number => {
    if (a.timeStart > b.timeStart) {
      return 1;
    } else if (a.timeStart < b.timeStart) {
      return -1;
    } else {
      return 0;
    }
  };

  constructor(private communicationService: CommunicationService,
              private classesService: ClassesService,
              private cd: ChangeDetectorRef,
              private reportService: ReportsService,
              private dialog: MatDialog,
              private selectionStrategyEventEmitter: SelectionStrategyEventEmitter<Moment>) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


  updateScheduleWeekDates(scheduleDate: DateRange<Moment>) {
    this.scheduleWeekDays = [];
    const startDate = scheduleDate.start.clone();
    const endDate = scheduleDate.end.clone();
    const tmpMoment = moment();
    // console.log("startMonth", startDate.month(), "endDateMonth ", endDate.month() );
    let startDay; //  = startDate.date();
    let endDay; //  =

    if( tmpMoment.month() != startDate.month() ) {
      tmpMoment.month(startDate.month());
    }

    if (startDate.month() != endDate.month()) {
      startDay = startDate.date();
      endDay = startDate.daysInMonth();


      for (let day = startDay; day <= endDay; day++) {
        const newMoment = tmpMoment.date(day); // .month(startMonthIdx);
        this.scheduleWeekDays.push({day: newMoment.day(), label: moment.weekdaysShort()[newMoment.day()], date: newMoment.startOf('day').toDate()});
      }

      startDay = 1;
      endDay = endDate.date();
      tmpMoment.month(endDate.month());
    } else {
      startDay = startDate.date();
      endDay = endDate.date();
    }

    for (let day = startDay; day <= endDay; day++) {
      const newMoment = tmpMoment.date(day); // .month(startMonthIdx);
      this.scheduleWeekDays.push({day: newMoment.day(), label: moment.weekdaysShort()[newMoment.day()], date: newMoment.startOf('day').toDate()});
    }

  }

  // getSchedules(from: Moment, to: Moment): Observable<DaySchedule[]> {
  //   return this.communicationService.getSchedules(from.toDate(), to.toDate()).pipe(
  //     map<ClassSchedule[], DaySchedule[]>( classSchedule => {
  //     return classSchedule.map(
  //         schedule => {
  //           return {...schedule, ...{signedMembers$: new BehaviorSubject(schedule.signedMembers)}}
  //         });
  //     }
  //   ))
  // }

  ngOnInit(): void {
    this.classes = this.classesService.getClasses();

    // By default we are using current date
    const fromDate = moment(new Date());
    const toDate = moment(new Date());
    const from = fromDate.startOf('week');
    const to = toDate.endOf('week');
    this.scheduleDate = new DateRange(from, to);
    this.updateScheduleWeekDates(this.scheduleDate);

    this.communicationService.getSchedules(from.toDate(), to.toDate()).subscribe((schedules) => {
      this.schedules$.next(schedules);
    });


    this.subscriptions.push(this.selectionStrategyEventEmitter.selectMonth$.subscribe(() => {
      this.filterScheduleDates(this.calendar.activeDate, 'month');
    }));
  }


  filterScheduleDates(value: Moment, strategy?: string) {
    const endDate = value.clone();
    if (!strategy) {
      strategy = this.selectionStrategyEventEmitter.strategyChanged$.getValue();
    }
    let start: Moment;
    let end: Moment;
    switch (strategy) {
      case 'week': {
        start = value.startOf('week');
        end = endDate.endOf('week');
      }
        break;
      case 'month': {
        start = value.startOf('month');
        end = endDate.endOf('month');
      }
        break;

    }

    this.scheduleDate = new DateRange(start, end);
    this.updateScheduleWeekDates(this.scheduleDate);
    this.communicationService.getSchedules(start.toDate(), end.toDate()).subscribe((schedules) => {
      this.schedules$.next(schedules);
    });
  }

  signIn(daySchedule: DaySchedule, scheduleWeekDay: ScheduleWeekDay) {
    const signInDate = this.scheduleDate.start.clone()
      .add(daySchedule.day, 'days')
      .startOf('day')
      .add(daySchedule.timeStart, 'milliseconds');

    const data: SignInDialogData = {signInDate:signInDate, daySchedule: daySchedule, scheduleWeekDay: scheduleWeekDay};
    this.dialog.open(SignInDialogComponent, {
      width: '800px',
      data: data
    })
      .afterClosed().subscribe((membersToSignIn: SignInMember[]) => {

      if (!membersToSignIn) {
        return;
      }

      if (membersToSignIn && membersToSignIn.length > 0) {
        const signedMembers = daySchedule.signedMembers$.getValue();

        let membersIdsToSign = [];
        if( signedMembers.length == 0 ) {
          membersIdsToSign = membersToSignIn.map( memberToSign => memberToSign.member.id );
        } else {
          for( const memberToSign of membersToSignIn ) {
            const possibleSignMember = signedMembers.find( signMember => signMember.memberId == memberToSign.member.id )
              if( possibleSignMember == null) {
                membersIdsToSign.push(memberToSign.member.id);
              }
          }
        }

        this.communicationService
          .signIn(daySchedule.id, membersIdsToSign, signInDate.toDate())
          .toPromise().then((newSignedMembers: ScheduleMember[]) => {
          daySchedule.signedMembers$.next([...newSignedMembers, ...daySchedule.signedMembers$.getValue()]);
        });
      }

    });
  }

  addSchedule(day?: string) {
    this.dialog.open(AddScheduleDialogComponent).afterClosed().subscribe((schedule: PrimalClassSchedule) => {
      if (schedule) {
        const newSchedules: ClassSchedule[] = schedule.days.map((newDay) => {
          return {
            id: 0,
            timeStart: schedule.startTime,
            timeEnd: schedule.endTime,
            classId: schedule.selectedClass.id,
            scheduleFrom: schedule.scheduleFrom,
            scheduleUntil: schedule.scheduleUntil,
            signedMembers: [],
            day: newDay,
            capacity: schedule.capacity,
            //TODO:: TAKE BRANCH ID HERE
            branchId: null
          };
        });


        this.communicationService.addSchedules(newSchedules).subscribe(daySchedules => {
          this.schedules$.next([...this.schedules$.getValue(), ...daySchedules]);
        });
      }

    });
  }

  remove(daySchedule: DaySchedule) {
    console.log(daySchedule);
  }

  attendanceReport() {
    const report = this.reportService.reportsSub.getValue().find(r => r.name == 'Attendance Report');
    this.dialog.open(AttendanceReportComponent).afterClosed().subscribe(filter => report.func(filter));
  }
}
