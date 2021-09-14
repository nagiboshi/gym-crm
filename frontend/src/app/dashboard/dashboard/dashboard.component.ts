import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ChartType, Column, Row} from 'angular-google-charts';
import {MembersService} from '../../members/members.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, AfterViewInit {
  salesChartType: ChartType;
  salesChartColumns: Column[];
  salesChartData: Row[];
  currentDate = new Date();
  newMembersData: Row[] = [];
  membershipSoldData: Row[] = [];
  @ViewChild('dashBoards')
  dashBoardsElRef: ElementRef;
  chartWidth = 0;
  constructor(private membersService: MembersService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.chartWidth =  this.dashBoardsElRef.nativeElement.offsetWidth / 3 - 90;
    }, 0)
  }

  ngAfterViewInit(): void {
    // console.log( this.dashBoardsElRef.nativeElement.offsetWidth);
    this.salesChartType = ChartType.Histogram;
    this.salesChartColumns = [{ label: 'Month' }, {label: 'Sales', type: 'number' }, {label: 'Expenses', type: 'number'}];
    this.salesChartData =  [
      ['May', 1000, 2000],
      ['April', 3000,2500]];
    this.membersService.newMembersStatistic().toPromise().then((stat) => {
      console.log(stat);
    })

    this.newMembersData = [
      ['Men', 100 ],
      ['Women', 200],
      ['Child', 150]
    ];
    this.membershipSoldData = [
      ['a',100
      ], ['b',200]];

  }

}
