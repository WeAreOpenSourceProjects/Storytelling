import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import { PresentationsState } from './presentations.interfaces';
import * as fromPresentations from './presentations.actions';
import { map } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';
import { catchError } from 'rxjs/operators/catchError';
import { toPayload } from '@ngrx/effects';
import { PresentationsApiService } from '../services/presentations.api.service';
import { fromAuthentication } from '@labdat/authentication-state';
import { fromSlides } from '@labdat/slides-state';
import { fromBoxes } from '@labdat/boxes-state';
import { mapTo } from 'rxjs/operators/mapTo';
import { Presentation } from '@labdat/data-models';

@Injectable()
export class PresentationsEffects {

  @Effect()
  loginSuccess$ = this.actions
    .ofType(fromAuthentication.LOGIN_SUCCESS)
    .pipe(mapTo(new fromPresentations.Load({ pageIndex: 0, pageSize: 10})))

  @Effect()
  load = this.dataPersistence.fetch(fromPresentations.LOAD, {
    run: (action: fromPresentations.Load, state: PresentationsState) => {
      const { pageIndex, pageSize, search } = action.payload
      return this.presentationsApiService.search(pageIndex, pageSize, search)
        .pipe(map(result => new fromPresentations.LoadSuccess(result)))
    },
    onError: (action: fromPresentations.Load, error) => {
      console.error('Error', error);
      return new fromPresentations.LoadFailure(error);
    }
  });

  @Effect()
  add = this.actions
    .ofType(fromPresentations.ADD)
    .pipe(
      map(toPayload),
      switchMap((presentation) => this.presentationsApiService.add(presentation)),
      map((response: Presentation) => new fromPresentations.AddSuccess(response)),
      catchError(error => of(new fromPresentations.AddFailure(error)))
    );

  @Effect()
  copy = this.actions
    .ofType(fromPresentations.COPY)
    .pipe(
      map(toPayload),
      switchMap((payload) => this.presentationsApiService.copy(payload)),
      map((response: any) => new fromPresentations.CopySuccess(response)),
      catchError(error => of(new fromPresentations.CopyFailure(error)))
    );

  @Effect()
  update = this.dataPersistence.optimisticUpdate(fromPresentations.UPDATE, {
    run: (action: fromPresentations.Update, state: PresentationsState) => {
      return this.presentationsApiService.update(action.payload)
        .pipe(map(() => new fromPresentations.UpdateSuccess(action.payload)))
    },
    undoAction: (action: fromPresentations.Update, error) => {
      console.error('Error', error);
      return new fromPresentations.UpdateFailure(error);
    }
  });

  @Effect()
  delete$ = this.actions
    .ofType(fromPresentations.DELETE)
    .pipe(
      map(toPayload),
      switchMap(presentationId => this.presentationsApiService.delete(presentationId)),
      map((response: any) => new fromPresentations.DeleteSuccess(response)),
      catchError(error => of(new fromPresentations.DeleteFailure(error)))
    )

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<PresentationsState>,
    private presentationsApiService: PresentationsApiService) {}
}
