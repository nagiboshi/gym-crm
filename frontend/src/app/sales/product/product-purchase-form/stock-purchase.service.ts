import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StockPurchase} from '@models/stock-purchase';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class StockPurchaseService {
  apiPath = `/api/stock-purchase`;
  newPurchaseSubj: Subject<StockPurchase> = new Subject();
  newPurchase$ = this.newPurchaseSubj.asObservable();
  constructor(private http: HttpClient) {
  }

  save(purchase: StockPurchase): Promise<StockPurchase> {
   return this.http.post<StockPurchase>(this.apiPath,purchase).toPromise().then((purchase) => {
      this.newPurchaseSubj.next(purchase);
      return purchase;
   });
  }
}
