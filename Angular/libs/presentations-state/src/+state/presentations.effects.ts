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

@Injectable()
export class PresentationsEffects {

  @Effect()
  loginSuccess$ = this.actions
    .ofType(fromAuthentication.LOGIN_SUCCESS)
    .pipe(mapTo(new fromPresentations.Load()))

  @Effect()
  load = this.dataPersistence.fetch(fromPresentations.LOAD, {
    run: (action: fromPresentations.Load, state: PresentationsState) => {
      return this.presentationsApiService.getAll(0, 10)
        .map(presentations => presentations.map(presentation => ({ ...presentation, id: presentation._id })))
        .map(presentations => new fromPresentations.LoadSuccess({ presentations }))
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
      switchMap((payload) => this.presentationsApiService.add(payload.presentations)),
      map((response: any) => new fromPresentations.AddSuccess({ presentation: response })),
      catchError(error => of(new fromPresentations.AddFailure(error)))
    )
;

  @Effect()
  update = this.dataPersistence.optimisticUpdate(fromPresentations.UPDATE, {
    run: (action: fromPresentations.Update, state: PresentationsState) => {
      return new fromPresentations.UpdateSuccess(action.payload);
    },
    undoAction: (action: fromPresentations.Update, error) => {
      console.error('Error', error);
      return new fromPresentations.UpdateFailure(error);
    }
  });

  delete$ = this.actions
    .ofType(fromPresentations.DELETE)
    .pipe(
      map(toPayload),
      switchMap((payload) => this.presentationsApiService.delete(payload.presentationId)),
      map((response: any) => from([
        new fromPresentations.DeleteSuccess({presentationId: response.presentationId}),
        new fromSlides.DeleteSuccess({slideIds: response.slideIds}),
        new fromBoxes.DeleteSuccess({boxeIds: response.boxeIds})
      ])),
      catchError(error => of(new fromPresentations.DeleteFailure(error)))
    )

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<PresentationsState>,
    private presentationsApiService: PresentationsApiService) {}
}
