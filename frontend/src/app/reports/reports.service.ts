import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {MemberReportFilter, MembersReportComponent} from './members-report/members-report.component';
import {ReportDialog} from './report-dialog';
import {AttendanceReportComponent} from './attendance-report/attendance-report.component';
import {SalesReportComponent} from './sales-report/sales-report.component';
import {ComponentType} from '@angular/cdk/portal';
import {HelpersService} from '@shared/helpers.service';

export interface AttendanceFilter {
  attendanceClassIds: Array<number>;
  fromDate: Date;
  toDate: Date;
  startTime: number;
  endTime: number;
  memberIds: Array<number>;
}

export interface SalesReportFilter {
  type: 'stock' | 'service';
  fromDate: Date;
  toDate: Date;
}

export class Report {
  name: 'Sales Report' | 'Attendance Report' | 'Stock Valuation Report' | 'Members Report';
  dialog: ComponentType<ReportDialog>;
  func: (data?: any) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  reportsSub = new BehaviorSubject<Report[]>([
    {
      name: 'Sales Report', dialog: SalesReportComponent, func: async (filter) => {
        const blob = await this.generateSalesReport(filter).toPromise();
        this.helpers.download(blob, 'sales-report.xls');
      },
    },
    {
      name: 'Attendance Report', dialog: AttendanceReportComponent, func: async (filter) => {
        const blob = await this.generateAttendanceReport(filter).toPromise();
        this.helpers.download(blob, 'attendance-report.xls');
      }
    },
    {
      name: 'Stock Valuation Report', dialog: null,  func: async () => {
       const blob = await this.generateValuationReport().toPromise();
       this.helpers.download(blob, 'stock-valuation-report.xls');
      }
    },
    {
      name: 'Members Report', dialog: MembersReportComponent, func: async (filter) => {
        const blob = await this.generateMembersReport(filter).toPromise();
        this.helpers.download(blob, 'members-report.xls');
      }
    }]);
  reports$ = this.reportsSub.asObservable();

  generateSalesReport(filter: SalesReportFilter) {
    return this.http.post('/api/reports/salesReport', filter, {responseType: 'blob'});
  }

  generateAttendanceReport(filter: AttendanceFilter): Observable<Blob> {
    return this.http.post('/api/reports/attendanceReport', filter, {responseType: 'blob'});
  }

  generateMembersReport(filter: MemberReportFilter) {
    return this.http.post('/api/reports/membersReport', filter, {responseType: 'blob'});
  }

  generateValuationReport(): Observable<Blob> {
    return this.http.post('/api/reports/stockValuation', {},{responseType: 'blob'});
  }

  constructor(private http: HttpClient, private helpers: HelpersService) {
  }
}
