import { createSelector, createFeatureSelector } from '@ngrx/store';
import { SlidesState, slidesAdapter } from './slides.interfaces';
import * as fromSlides from './slides.actions';
import { isEmpty } from 'lodash';

const selectSlidesState = createFeatureSelector<SlidesState>('slides');

export const {
  selectIds: selectSlideIds,
  selectEntities: selectSlideEntities,
  selectAll: selectAllSlides,
  selectTotal: selectSlidesTotal
} = slidesAdapter.getSelectors(selectSlidesState);

export const selectSlidesLoading = createSelector(selectSlidesState, (state: SlidesState) => state.loading);
export const selectCurrentPresentationId = createSelector(
  selectSlidesState,
  (state: SlidesState) => state.currentPresentationId
);
export const selectSlidesLoaded = createSelector(selectSlidesState, (state: SlidesState) => state.loaded);
export const selectCurrentSlideId = createSelector(selectSlidesState, (state: SlidesState) => state.currentSlideId);
export const selectCurrentSlide = createSelector(
  selectSlideEntities,
  selectCurrentSlideId,
  (entities, id) => {
    return entities[id]
  });
export const selectCurrentSlideIndex = createSelector(selectCurrentSlide, slide => slide.index);
export const selectCurrentSlideBoxes = createSelector(selectCurrentSlide, slide => slide.boxIds);
