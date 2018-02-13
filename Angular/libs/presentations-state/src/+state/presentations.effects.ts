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
import { tap } from 'rxjs/operators/tap';
import { Presentation } from '@labdat/data-models';
import { PresentationsSnackComponent } from '../components/presentations-snack/presentations-snack.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class PresentationsEffects {

  @Effect()
  search$ = this.dataPersistence.fetch(fromPresentations.SEARCH, {
    run: (action: fromPresentations.Search, state: PresentationsState) => {
      const { pageIndex, pageSize, search } = action.payload
      return this.presentationsApiService.search(pageIndex, pageSize, search)
        .pipe(map((result) => {
          return new fromPresentations.SearchSuccess(result)
        }))
    },
    onError: (action: fromPresentations.Search, error) => {
      console.error('Error', error);
      return new fromPresentations.SearchFailure(error);
    }
  });

  @Effect()
  getOne$ = this.dataPersistence.fetch(fromPresentations.GET_ONE, {
    run: (action: fromPresentations.GetOne, state: PresentationsState) => {
      return this.presentationsApiService.getOne(action.payload.presentationId)
        .pipe(map(result => new fromPresentations.GetOneSuccess({ presentation: result })))
    },
    onError: (action: fromPresentations.GetOne, error) => {
      console.error('Error', error);
      return new fromPresentations.GetOneFailure(error);
    }
  });

  @Effect()
  add$ = this.actions
    .ofType(fromPresentations.ADD)
    .pipe(
      map(toPayload),
      switchMap((presentation) => this.presentationsApiService.add(presentation)),
      map((response: Presentation) => new fromPresentations.AddSuccess(response)),
      tap(() =>
        this.snackBar.openFromComponent(PresentationsSnackComponent, {
          duration: 1000,
          data: 'Presentation Add Success',
          horizontalPosition: 'right',
          verticalPosition: 'top'
        })
      ),
      catchError(error => of(new fromPresentations.AddFailure(error)))
    );

  @Effect()
  copy$ = this.actions
    .ofType(fromPresentations.COPY)
    .pipe(
      map(toPayload),
      switchMap((payload) => this.presentationsApiService.copy(payload)),
      map((response: any) => new fromPresentations.CopySuccess(response)),
      tap(() =>
        this.snackBar.openFromComponent(PresentationsSnackComponent, {
          duration: 1000,
          data: 'Presentation Copy Success',
          horizontalPosition: 'right',
          verticalPosition: 'top'
        })
      ),
      catchError(error => of(new fromPresentations.CopyFailure(error)))
    );

  @Effect()
  update$ = this.dataPersistence.optimisticUpdate(fromPresentations.UPDATE, {
    run: (action: fromPresentations.Update, state: PresentationsState) => {
      return this.presentationsApiService.update(action.payload)
      .pipe(
        tap(() =>
          this.snackBar.openFromComponent(PresentationsSnackComponent, {
            duration: 1000,
            data: 'Presentation Update Success',
            horizontalPosition: 'right',
            verticalPosition: 'top'
          })
        ),
        map(() => new fromPresentations.UpdateSuccess(action.payload))
      );
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
      tap(() =>
        this.snackBar.openFromComponent(PresentationsSnackComponent, {
          duration: 1000,
          data: 'Presentation Delete Success',
          horizontalPosition: 'right',
          verticalPosition: 'top'
        })
      ),
      catchError(error => of(new fromPresentations.DeleteFailure(error)))
    )

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<PresentationsState>,
    private presentationsApiService: PresentationsApiService,
    private snackBar: MatSnackBar ) { }
}
