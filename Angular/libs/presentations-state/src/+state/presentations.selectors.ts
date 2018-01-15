import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PresentationsState, presentationsAdapter } from './presentations.interfaces';
import * as fromPresentations from './presentations.actions';
import { isEmpty } from 'lodash';

const selectPresentationsState = createFeatureSelector<PresentationsState>('presentations');

export const {
  selectIds: selectPresentationsIds,
  selectEntities: selectPresentationsEntities,
  selectAll: selectAllPresentations,
  selectTotal: selectPresentationsTotal,
} = presentationsAdapter.getSelectors(selectPresentationsState);

export const selectPresentationsLoading = createSelector(selectPresentationsState, (state: PresentationsState) => state.loading);
export const selectPresentationsLoaded = createSelector(selectPresentationsState, (state: PresentationsState) => state.loaded);
export const selectPresentationsError = createSelector(selectPresentationsState, (state: PresentationsState) => state.error);

export const selectedPresentationId = createSelector(selectPresentationsState, (state: PresentationsState) => state.selectedPresentationId);
export const selectSelectedPresentation = createSelector(selectPresentationsEntities, selectedPresentationId, (presentationsEntities, presentationId) => selectPresentationsEntities[presentationId]);

export const selectCurrentPresentationTitle = createSelector(selectSelectedPresentation, presentation => presentation.title);
export const selectCurrentPresentationIsPublic = createSelector(selectSelectedPresentation, presentation => presentation.isPublic);
export const selectCurrentPresentationIsFavorite = createSelector(selectSelectedPresentation, presentation => presentation.isFavorite);
export const selectCurrentPresentationDescription = createSelector(selectSelectedPresentation, presentation => presentation.description);
export const selectCurrentPresentationTags = createSelector(selectSelectedPresentation, presentation => presentation.tags);
export const selectCurrentPresentationAuthor = createSelector(selectSelectedPresentation, presentation => presentation.author);
export const selectCurrentPresentationBanner = createSelector(selectSelectedPresentation, presentation => presentation.banner);
export const selectCurrentPresentationSlides = createSelector(selectSelectedPresentation, presentation => presentation.slides);

