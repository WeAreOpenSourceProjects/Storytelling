import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/take';
import { AuthenticationState, selectIsLoggedIn, selectTokenExpiresIn, fromAuthentication } from '@labdat/authentication-state';
import { fromRouter } from '@labdat/router-state';
import { selectCurrentPresentationId, selectSlidesLoaded, fromSlides } from '@labdat/slides-state';
import { filter } from 'rxjs/operators/filter';
import { zip } from 'rxjs/operators/zip';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators/take';

@Injectable()
export class SlidesGuardService implements CanActivate {

  private currentPresentationId$ = this.store.select(selectCurrentPresentationId);
  private slidesLoaded$ = this.store.select(selectSlidesLoaded);

  constructor(private store: Store<AuthenticationState>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.currentPresentationId$.subscribe(presentationId => this.store.dispatch(new fromSlides.Load({ presentationId })));
    return this.slidesLoaded$.pipe(filter(loaded => loaded), take(1));
  }
}
