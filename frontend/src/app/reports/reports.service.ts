import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {


  generateValuationReport(): Observable<Blob> {
  return this.http.get('/api/reports/stockValuation', {responseType: 'blob'});
  }

  constructor(private http: HttpClient) {
  }
}
