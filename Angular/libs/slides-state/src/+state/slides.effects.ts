import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import { SlidesState } from './slides.interfaces';
import * as fromSlides from './slides.actions';
import { map } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';
import { catchError } from 'rxjs/operators/catchError';
import { toPayload } from '@ngrx/effects';
import { SlidesApiService } from '../services/slides.api.service';
import { fromAuthentication } from '@labdat/authentication-state';
import { mapTo } from 'rxjs/operators/mapTo';
import { Slide } from '@labdat/data-models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SlidesSnackComponent } from '../components/slides-snack/slides-snack.component';
import { tap } from 'rxjs/operators/tap';

@Injectable()
export class SlidesEffects {

  @Effect()
  load = this.dataPersistence.fetch(fromSlides.LOAD, {
    run: (action: fromSlides.Load, state: SlidesState) => {
      return this.slidesApiService.getPresentationSlides(action.payload.presentationId).pipe(
        map(slides => new fromSlides.LoadSuccess({ slides }))
      )
    },
    onError: (action: fromSlides.Load, error) => {
      console.error('Error', error);
      return new fromSlides.LoadFailure(error);
    }
  });

  @Effect()
  add = this.actions
    .ofType(fromSlides.ADD)
    .pipe(
      map(toPayload),
      switchMap((payload) => this.slidesApiService.add(payload)),
      tap(() =>
        this.snackBar.openFromComponent(SlidesSnackComponent, {
          duration: 1000,
          data: 'Slide Add Success',
          horizontalPosition: 'right',
          verticalPosition: 'top'
        })
      ),
      map((response: any) => new fromSlides.AddSuccess(response)),
      catchError(error => of(new fromSlides.AddFailure(error)))
    )
;

  @Effect()
  update = this.dataPersistence.optimisticUpdate(fromSlides.UPDATE, {
    run: (action: fromSlides.Update, state: SlidesState) => new fromSlides.UpdateSuccess(action.payload),
    undoAction: (action: fromSlides.Update, error) => {
      console.error('Error', error);
      return new fromSlides.UpdateFailure(error);
    }
  });

  @Effect()
  delete$ = this.actions
    .ofType(fromSlides.DELETE)
    .pipe(
      map(toPayload),
      switchMap((payload) => this.slidesApiService.delete(payload)),
      tap(() =>
        this.snackBar.openFromComponent(SlidesSnackComponent, {
          duration: 1000,
          data: 'Slide Delete Success',
          horizontalPosition: 'right',
          verticalPosition: 'top'
        })
      ),
      map(slide => ({ ...slide, id: slide._id })),
      map((slide: Slide) => new fromSlides.DeleteSuccess(slide)),
      catchError(error => of(new fromSlides.DeleteFailure(error)))
    )

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<SlidesState>,
    private slidesApiService: SlidesApiService,
    private snackBar: MatSnackBar) {}
}
