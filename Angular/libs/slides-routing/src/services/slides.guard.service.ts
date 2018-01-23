import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/take';
import { AuthenticationState, selectIsLoggedIn, selectTokenExpiresIn, fromAuthentication } from '@labdat/authentication-state';
import { fromRouter } from '@labdat/router-state';
import { selectCurrentSlideId, selectSlidesLoaded, fromSlides } from '@labdat/slides-state';
import { filter } from 'rxjs/operators/filter';
import { zip } from 'rxjs/operators/zip';
import { of } from 'rxjs/observable/of';

@Injectable()
export class SlidesGuardService implements CanActivate {

  private currentSlideId$ = this.store.select(selectCurrentSlideId);
  private slidesLoaded$ = this.store.select(selectSlidesLoaded);

  constructor(private store: Store<AuthenticationState>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.currentSlideId$.subscribe(slideId => this.store.dispatch(new fromSlides.Load({ slideId })));
    return this.slidesLoaded$;
  }
}
