import {Injectable} from '@angular/core';

@Injectable({providedIn:'root'})
export class AccountService {
  userValue: any = {username: 'admin', password: 'admin'};
}
