import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/take';
import {
  AuthenticationState,
  selectIsLoggedIn,
  selectTokenExpiresIn,
  fromAuthentication
} from '@labdat/authentication-state';
import { fromRouter } from '@labdat/router-state';

@Injectable()
export class AuthenticationGuardService implements CanActivate, CanLoad {
  constructor(private store: Store<AuthenticationState>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    console.log(route.url);
    const currentUrl = route.url[0] ? route.url[0].path : '';
    return this.hasPermission(currentUrl);
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    const currentUrl = route.path;
    return this.hasPermission(currentUrl);
  }

  hasPermission(path: string) {
    return Observable.combineLatest(
      this.store.select(selectIsLoggedIn),
      this.store.select(selectTokenExpiresIn),
      (loggedIn, tokenExpiresIn) => {
        if (loggedIn) {
          if (path === 'auth') {
            this.store.dispatch(new fromRouter.Go({ path: ['/', 'home'] }));
          }
          return true;
        } else {
          if (tokenExpiresIn) {
            if (tokenExpiresIn < Date.now()) {
              if (path === 'auth') {
                this.store.dispatch(new fromRouter.Go({ path: ['/', 'home'] }));
              }
              return true;
            } else {
              this.store.dispatch(new fromAuthentication.Logout());
              return false;
            }
          } else {
            if (path === 'auth') {
              return true;
            }
            this.store.dispatch(new fromRouter.Go({ path: ['/', 'auth'] }));
            return false;
          }
        }
      }
    ).take(1);
  }
}
