import { Store } from '@ngrx/store';
import {
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { switchMap } from 'rxjs/operators/switchMap'
import { first } from 'rxjs/operators/first';
import { _throw } from 'rxjs/observable/throw';
import { catchError } from 'rxjs/operators/catchError';
import {
  fromAuthentication,
  selectTokenExpiresIn,
  AuthenticationState } from '@labdat/authentication-state';
import { isEmpty } from 'lodash';

@Injectable()
export class AuthenticationInterceptorService implements HttpInterceptor {
  private urlFilters = ['/api'];
  private tokenExpiresIn$;

  constructor(private store: Store<AuthenticationState>) {
    this.tokenExpiresIn$ = this.store.select(selectTokenExpiresIn);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (!/\/api\//.exec(request.url)) {
      return next.handle(request);
    }

    return this.tokenExpiresIn$.pipe(
      first(),
      switchMap(tokenExpiresIn => {
        if (tokenExpiresIn && tokenExpiresIn < Date.now()) {
          this.store.dispatch(new fromAuthentication.Logout('Token Expired'));
          return empty();
        }

        const req = request.clone({
          withCredentials: true
        });

        return next.handle(req).pipe(
          catchError(error => {
            if (error instanceof HttpErrorResponse && error.status === 403 && !error.url.includes('/auth')) {
              this.store.dispatch(new fromAuthentication.Logout('Unauthorized Operation'));
              return empty();
            }
            return _throw(error);
          })
        );
      })
    )
  }
}
