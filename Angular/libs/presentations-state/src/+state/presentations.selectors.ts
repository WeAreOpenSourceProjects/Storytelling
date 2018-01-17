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

export const selectCurrentPresentationId = createSelector(selectPresentationsState, (state: PresentationsState) => state.currentPresentationId);
export const selectCurrentPresentation = createSelector(selectPresentationsEntities, selectCurrentPresentationId, (presentationsEntities, presentationId) => presentationsEntities[presentationId]);

export const selectCurrentPresentationTitle = createSelector(selectCurrentPresentation, presentation => presentation.title);
export const selectCurrentPresentationIsPublic = createSelector(selectCurrentPresentation, presentation => presentation.public);
export const selectCurrentPresentationIsFavorite = createSelector(selectCurrentPresentation, presentation => presentation.favorite);
export const selectCurrentPresentationDescription = createSelector(selectCurrentPresentation, presentation => presentation.description);
export const selectCurrentPresentationTags = createSelector(selectCurrentPresentation, presentation => presentation.tags);
export const selectCurrentPresentationAuthorId = createSelector(selectCurrentPresentation, presentation => presentation.authorId);
export const selectCurrentPresentationBanner = createSelector(selectCurrentPresentation, presentation => presentation.banner);
export const selectCurrentPresentationSlideIds = createSelector(selectCurrentPresentation, presentation => presentation.slideIds);

