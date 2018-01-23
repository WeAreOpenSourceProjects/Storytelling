import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { fromPresentations, PresentationsState, selectPresentationsLoaded, selectCurrentPresentationId } from '@labdat/presentations-state'
import { filter } from 'rxjs/operators/filter';

@Injectable()
export class PresentationGuardService implements CanActivate {
  constructor(private store: Store<PresentationsState>) {}

  private currentPresentationId$ = this.store.select(selectCurrentPresentationId);
  private presentationsLoaded$ = this.store.select(selectPresentationsLoaded)

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    this.currentPresentationId$
    .subscribe(presentationId => this.store.dispatch(new fromPresentations.GetOne({ presentationId })));

    return this.presentationsLoaded$.pipe(filter(loaded => loaded));
  }
}
