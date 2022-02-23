import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class PropertyService {
  constructor(private httpClient: HttpClient) {
  }

  remove(id: number) {
    return this.httpClient.delete(`/api/property/${id}`).toPromise();
  }
}
