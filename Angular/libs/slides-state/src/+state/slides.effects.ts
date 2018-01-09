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

@Injectable()
export class SlidesEffects {
  @Effect()
  load = this.dataPersistence.fetch(fromSlides.LOAD, {
    run: (action: fromSlides.Load, state: SlidesState) => {
      return this.slidesApiService.getSlidesList(0, 10)
        .map(slides => slides[0].map(slide => ({...slide, id: slide._id})))
        .map(slides => new fromSlides.LoadSuccess({ slides })  )
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
      switchMap((payload) => this.slidesApiService.submitSlides(payload.slides)),
      map((response: any) => new fromSlides.AddSuccess({ slide: response })),
      catchError(error => of(new fromSlides.AddFailure(error)))
    )
;

  @Effect()
  update = this.dataPersistence.optimisticUpdate(fromSlides.UPDATE, {
    run: (action: fromSlides.Update, state: SlidesState) => {
      return new fromSlides.UpdateSuccess(action.payload);
    },
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
      switchMap((payload) => this.slidesApiService.deleteSlides(payload.slideId)),
      map((response: any) => new fromSlides.DeleteSuccess({slideId: response.id})),
      catchError(error => of(new fromSlides.DeleteFailure(error)))
    )

  constructor(
    private actions: Actions,
    private dataPersistence: DataPersistence<SlidesState>,
    private slidesApiService: SlidesApiService) {}
}
