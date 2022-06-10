import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Tax} from '@models/tax';
import {BehaviorSubject} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  taxesSub = new BehaviorSubject<Tax[]>([]);
  constructor(private http: HttpClient) {

  }

  fetchTaxes() {
    return this.http.get<Tax[]>('/api/tax').pipe(tap((taxes) => {
      taxes = taxes.map( t => {
        t.value = parseFloat(t.value as any as string);
        return t;
      });
      this.taxesSub.next(taxes);
    }));
  }

  getTaxes():Tax[] {
      return this.taxesSub.getValue();
  }

  addTax(tax: Tax):Promise<Tax>  {
    return this.http.post<Tax>('/api/tax', tax).pipe(tap((newTax) => {
      const taxValue = newTax.value as any as string;
      newTax.value = parseFloat(taxValue);
      this.taxesSub.next([newTax, ...this.taxesSub.getValue()])
    })).toPromise();
  }

  delete(id: string) {
    return this.http.delete(`/api/tax/${id}`).pipe(tap(() => {
      const idx = this.taxesSub.getValue().findIndex(t => t.id == parseInt(id));
      if( idx != -1 ) {
        const taxes = this.taxesSub.getValue().splice(idx, 1);
        this.taxesSub.next(taxes);

      }
    })).toPromise();
  }
}
