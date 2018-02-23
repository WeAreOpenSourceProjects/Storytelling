import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import {
  fromPresentations,
  PresentationsState,
  selectPresentationsLoaded,
  selectCurrentPresentationId
} from '@labdat/presentations-state';
import { filter } from 'rxjs/operators/filter';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { take } from 'rxjs/operators/take';
import { tap } from 'rxjs/operators/tap';
import { merge } from 'rxjs/observable/merge';
import { map } from 'rxjs/operators/map';

@Injectable()
export class PresentationGuardService implements CanActivate {
  constructor(private store: Store<PresentationsState>) {}

  private currentPresentationId$ = this.store.select(selectCurrentPresentationId);
  private presentationsLoaded$ = this.store.select(selectPresentationsLoaded);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const getPresenation$ = this.presentationsLoaded$.pipe(
      filter(loaded => !loaded),
      mergeMap(() => this.currentPresentationId$),
      tap(presentationId => this.store.dispatch(new fromPresentations.GetOne({ presentationId })))
    );

    const presenationAlreadyLoaded$ = this.presentationsLoaded$.pipe(filter(loaded => loaded));
    return merge(getPresenation$, presenationAlreadyLoaded$).pipe(
      filter((loaded: boolean) => loaded === true),
      take(1)
    );
  }
}
