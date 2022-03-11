import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface AttendanceFilter {
  attendanceClassIds: Array<number>;
  fromDate: Date;
  toDate: Date;
  startTime: number;
  endTime: number;
  memberIds: Array<number>;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {


  generateAttendanceReport(filter: AttendanceFilter): Observable<Blob> {
    return this.http.post('/api/reports/attendanceReport',  filter ,{responseType: 'blob'});
  }

  generateValuationReport(): Observable<Blob> {
    return this.http.get('/api/reports/stockValuation', {responseType: 'blob'});
  }

  constructor(private http: HttpClient) {
  }
}
