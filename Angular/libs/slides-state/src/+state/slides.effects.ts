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
import { from } from 'rxjs/observable/from';

@Injectable()
export class SlidesEffects {
  @Effect()
  load = this.dataPersistence.fetch(fromSlides.LOAD, {
    run: (action: fromSlides.Load, state: SlidesState) => {
      return this.slidesApiService
        .getPresentationSlides(action.payload.presentationId)
        .pipe(map(slides => new fromSlides.LoadSuccess({ slides })));
    },
    onError: (action: fromSlides.Load, error) => {
      console.error('Error', error);
      return new fromSlides.LoadFailure(error);
    }
  });

  @Effect()
  loadOne = this.actions.ofType(fromSlides.LOAD_ONE).pipe(
    map(toPayload),
    switchMap(payload => this.slidesApiService.getOneSlide(payload.slideId)),
    map((response: any) => new fromSlides.LoadOneSuccess({slide : response}))
  );

  @Effect()
  add = this.actions.ofType(fromSlides.ADD).pipe(
    map(toPayload),
    switchMap(payload => this.slidesApiService.add(payload)),
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
  );

  @Effect()
  bulkUpdate = this.dataPersistence.optimisticUpdate(fromSlides.BULK_UPDATE, {
    run: (action: fromSlides.BulkUpdate, state: SlidesState) =>
      this.slidesApiService.bulkUpdate(action.payload).pipe(
        tap(() =>
          this.snackBar.openFromComponent(SlidesSnackComponent, {
            duration: 1000,
            data: 'Slide Update Success',
            horizontalPosition: 'right',
            verticalPosition: 'top'
          })
        ),
        map(result => new fromSlides.BulkUpdateSuccess(action.payload))
      ),
    undoAction: (action: fromSlides.BulkUpdate, error) => {
      console.error('Error', error);
      return new fromSlides.BulkUpdateFailure(error);
    }
  });

  @Effect()
  update = this.actions.ofType(fromSlides.UPDATE).pipe(
    map(toPayload),
    switchMap(payload => this.slidesApiService.update(payload.slide)),
    tap(() =>
      this.snackBar.openFromComponent(SlidesSnackComponent, {
        duration: 1000,
        data: 'Slide Update Success',
        horizontalPosition: 'right',
        verticalPosition: 'top'
      })
    ),
    map((response: any) => new fromSlides.UpdateSuccess({slide : response})),
    catchError(error => of(new fromSlides.AddFailure(error)))
  );

  @Effect()
  delete$ = this.actions.ofType(fromSlides.DELETE).pipe(
    map(toPayload),
    switchMap(payload => this.slidesApiService.delete(payload.slideId)),
    tap(() =>
      this.snackBar.openFromComponent(SlidesSnackComponent, {
        duration: 1000,
        data: 'Slide Delete Success',
        horizontalPosition: 'right',
        verticalPosition: 'top'
      })
    ),
    map(slide => ({ ...slide, id: slide._id })),
    switchMap((slide: Slide) =>
      from([new fromSlides.UpdateOnDelete({ slide }), new fromSlides.DeleteSuccess({ slide })])
    ),
    catchError(error => of(new fromSlides.DeleteFailure(error)))
  );

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<SlidesState>,
    private slidesApiService: SlidesApiService,
    private snackBar: MatSnackBar
  ) {}
}
