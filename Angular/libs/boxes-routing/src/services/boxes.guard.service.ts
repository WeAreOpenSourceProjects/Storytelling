import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
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
import { selectBoxesLoaded, fromBoxes } from '@labdat/boxes-state';
import { selectCurrentSlideId } from '@labdat/slides-state';
import { filter } from 'rxjs/operators/filter';
import { zip } from 'rxjs/operators/zip';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators/take';
import { tap } from 'rxjs/operators/tap';
import { merge } from 'rxjs/observable/merge';
import { switchMap } from 'rxjs/operators/switchMap';

@Injectable()
export class BoxesGuardService implements CanActivate {
  private currentSlideId$ = this.store.select(selectCurrentSlideId);
  private boxesLoaded$ = this.store.select(selectBoxesLoaded);

  constructor(private store: Store<AuthenticationState>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.currentSlideId$.pipe(
      tap(console.log),
      tap(slideId => this.store.dispatch(new fromBoxes.Load({ slideId }))),

      switchMap(() => this.boxesLoaded$),
      filter(loaded => loaded)
    );
  }
}
