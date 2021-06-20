import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {User} from '../models/user';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map, tap} from 'rxjs/operators';
import jwt_decode from "jwt-decode";
import {RequestQueryBuilder} from '@nestjsx/crud-request';
export interface Token {
  access_token: string;
}

@Injectable({providedIn: 'root'})
export class UserService {
  private tokenSubject: BehaviorSubject<Token>;
  public token$: Observable<Token>;
  public users: BehaviorSubject<User[]>;
  public users$: Observable<User[]>;
  // public currentUser: BehaviorSubject<User>
  // public currentUser$: Observable<User>;
  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.tokenSubject = new BehaviorSubject<Token>(JSON.parse(localStorage.getItem('token')));
    this.token$ = this.tokenSubject.asObservable();
    // this.currentUser = new BehaviorSubject<User>(null);
    // this.currentUser$ = this.currentUser.asObservable();

    this.users = new BehaviorSubject<User[]>([]);
    this.users$ = this.users.asObservable();
  }

  public get token(): Token {
    return this.tokenSubject.value;
  }

  login(username, password, branchId) {
    // const query = RequestQueryBuilder.cre
    return this.http.post<Token>(`/api/auth/login`, {username, password, branchId})
      .pipe(map(tokenObject => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('token', JSON.stringify(tokenObject));
        // this.currentUser.next(jwt_decode(tokenObject.access_token));
        this.tokenSubject.next(tokenObject);
        return tokenObject;
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    this.router.navigate(['/login']);
  }

  addUser(user: FormData): Observable<User> {
    return this.http.post<User>('/api/user', user).pipe(tap((newUser => this.users.next([newUser, ...this.users.getValue()]))));
  }

  getAll() {
    return this.http.get<User[]>(`/api/user`).pipe(tap( users => this.users.next(users)));
  }

  getById(id: string) {
    return this.http.get<User>(`/api/user/${id}`);
  }

  update(id, params) {
    return this.http.put(`/api/user/${id}`, params)
      .pipe(map(x => {
        // update stored user if the logged in user updated their own record
        return x;
      }));
  }

  delete(id: string) {
    return this.http.delete(`/api/user/${id}`)
      .pipe(map(x => {
        return x;
      }));
  }
}
