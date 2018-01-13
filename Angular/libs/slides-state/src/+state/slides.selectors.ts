import { createSelector, createFeatureSelector } from '@ngrx/store';
import { SlidesState, slidesAdapter } from './slides.interfaces';
import * as fromSlides from './slides.actions';
import { isEmpty } from 'lodash';
import { Slides } from '@labdat/data-models';

const selectSlidesState = createFeatureSelector<SlidesState>('slides');

export const {
  selectIds: selectSlidesIds,
  selectEntities: selectSlidesEntities,
  selectAll: selectAllSlides,
  selectTotal: selectSlidesTotal,
} = slidesAdapter.getSelectors(selectSlidesState);

export const selectIsLoading = createSelector(selectSlidesState, (state: SlidesState) => state.loading);
export const selectIsLoaded = createSelector(selectSlidesState, (state: SlidesState) => state.loaded);
export const selectCurrentSlideId = createSelector(selectSlidesState, (state: SlidesState) => state.currentSlideId);
export const selectCurrentSlide = createSelector(selectSlidesEntities, selectCurrentSlideId, (entities, id) => entities[id]);
export const selectCurrentSlideIndex = createSelector(selectCurrentSlide, slide => slide.index);
export const selectCurrentSlideBoxes = createSelector(selectCurrentSlide, slide => slide.boxes);
