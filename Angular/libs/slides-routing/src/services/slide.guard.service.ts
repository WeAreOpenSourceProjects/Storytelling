import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/take';
import {
  AuthenticationState,
  selectIsLoggedIn,
  fromAuthentication
} from '@labdat/authentication';
import { fromRouter } from '@labdat/common/router-state';
import { selectCurrentSlideId, selectSlidesLoaded, fromSlides } from '@labdat/slides-state';
import { filter } from 'rxjs/operators/filter';
import { zip } from 'rxjs/operators/zip';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators/take';
import { tap } from 'rxjs/operators/tap';
import { merge } from 'rxjs/observable/merge';
import { switchMap } from 'rxjs/operators/switchMap';

@Injectable()
export class SlideGuardService implements CanActivate {
  private currentSlideId$ = this.store.select(selectCurrentSlideId);
  private slidesLoaded$ = this.store.select(selectSlidesLoaded);

  constructor(private store: Store<AuthenticationState>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    //    this.currentPresentationId$.subscribe(presentationId => this.store.dispatch(new fromSlides.Load({ presentationId })));
    //    return this.slidesLoaded$.pipe(filter(loaded => loaded), take(1));
    return this.currentSlideId$.pipe(
      tap(slideId => this.store.dispatch(new fromSlides.LoadOne({ slideId }))),
      switchMap(() => this.slidesLoaded$),
      filter(loaded => loaded)
    );
  }
}
