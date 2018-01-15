import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { fromPresentations, PresentationsState, selectPresentationsLoaded } from '@labdat/presentations-state'
import { filter } from 'rxjs/operators/filter';

@Injectable()
export class SlidesGuardService implements CanActivate {
  constructor(private store: Store<PresentationsState>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    this.store.dispatch(new fromPresentations.Load({
      pageIndex: 0, pageSize: 10, search: {
        title: '',
        favorite: 'indeterminate',
        public: 'indeterminate'
      }}))
    return this.store.select(selectPresentationsLoaded).pipe(filter(loaded => loaded));
  }
}
