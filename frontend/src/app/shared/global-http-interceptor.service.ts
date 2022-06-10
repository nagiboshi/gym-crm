import {ErrorHandler, Injectable, NgZone} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {GlobalErrorDialogComponent} from '@shared/global-error-dialog/global-error-dialog.component';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';
import {Router} from '@angular/router';

@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor{

  constructor(private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe( tap(() => {},
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status !== 401) {
            return;
          }
          this.router.navigateByUrl('/login');
        }
      }));
  }
}
