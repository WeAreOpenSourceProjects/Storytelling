import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import { BoxesState } from './boxes.interfaces';
import * as fromBoxes from './boxes.actions';
import { map } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';
import { catchError } from 'rxjs/operators/catchError';
import { toPayload } from '@ngrx/effects';
import { BoxesApiService } from '../services/boxes.api.service';
import { fromAuthentication } from '@labdat/authentication';
import { mapTo } from 'rxjs/operators/mapTo';
import { tap } from 'rxjs/operators';
import { fromSlides } from '@labdat/slides-state';

@Injectable()
export class BoxesEffects {
  @Effect()
  load = this.dataPersistence.fetch(fromBoxes.LOAD, {
    run: (action: fromBoxes.Load, state: BoxesState) => {
      return this.boxesApiService
        .getAll(action.payload.slideId)
        .map(boxes => boxes.map(boxe => ({ ...boxe, id: boxe._id })))
        .map(boxes => new fromBoxes.LoadSuccess({ boxes }));
    },
    onError: (action: fromBoxes.Load, error) => {
      console.error('Error', error);
      return new fromBoxes.LoadFailure(error);
    }
  });

  @Effect()
  add = this.actions
    .ofType(fromBoxes.ADD)
    
    .pipe(
      map(toPayload),
      switchMap(payload => this.boxesApiService.addBox(payload.box)),
      tap(console.log),
      map((response: any) => new fromBoxes.AddSuccess({ box: { ...response, editMode: true } })),
      catchError(error => of(new fromBoxes.AddFailure(error)))
    );

  @Effect()
  update = this.dataPersistence.optimisticUpdate(fromBoxes.UPDATE, {
    run: (action: fromBoxes.Update, state: BoxesState) => {
      return new fromBoxes.UpdateSuccess(action.payload);
    },
    undoAction: (action: fromBoxes.Update, error) => {
      console.error('Error', error);
      return new fromBoxes.UpdateFailure(error);
    }
  });

  @Effect()
  updateAll = this.actions
    .ofType(fromBoxes.UPDATE_ALL)
    .pipe(
      map(toPayload),
      switchMap(payload => this.boxesApiService.updateAll(payload)),
      map((response: any) => new fromBoxes.UpdateAllSuccess({ boxes: response })),
      catchError(error => of(new fromBoxes.UpdateAllFailure(error)))
    );

  @Effect()
  delete$ = this.actions
    .ofType(fromBoxes.DELETE)
    .pipe(
      map(toPayload),
      switchMap(payload => this.boxesApiService.delete(payload.boxId)),
      map((response: any) => new fromBoxes.DeleteSuccess({ boxId: response })),
      catchError(error => of(new fromBoxes.DeleteFailure(error)))
    );

  @Effect()
  deleteImage$ = this.actions
    .ofType(fromBoxes.DELETE_IMAGE)
    .pipe(
      map(toPayload),
      switchMap(payload => this.boxesApiService.deleteImage(payload.imageId)),
      map((response: any) => new fromBoxes.DeleteImageSuccess({ imageId: response })),
      catchError(error => of(new fromBoxes.DeleteImageFailure(error)))
    );
  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<BoxesState>,
    private boxesApiService: BoxesApiService
  ) {}
}
