import { createSelector, createFeatureSelector } from '@ngrx/store';
import { BoxesState, boxesAdapter } from './boxes.interfaces';
import * as fromBoxes from './boxes.actions';
import { isEmpty } from 'lodash';

const selectBoxesState = createFeatureSelector<BoxesState>('boxes');

export const {
  selectIds: selectBoxesIds,
  selectEntities: selectBoxesEntities,
  selectAll: selectAllBoxes,
  selectTotal: selectBoxesTotal,
} = boxesAdapter.getSelectors(selectBoxesState);

export const selectIsLoading = createSelector(selectBoxesState, (state: BoxesState) => state.loading);
export const selectIsLoaded = createSelector(selectBoxesState, (state: BoxesState) => state.loaded);
export const selectCurrentBoxId = createSelector(selectBoxesState, (state: BoxesState) => state.currentBoxId);
export const selectCurrentBox = createSelector(
  selectBoxesEntities,
  selectCurrentBoxId,
  (boxEntities, boxId) => boxEntities[boxId]);
export const selectCurrentBoxGrid = createSelector(selectCurrentBox, box => box);
export const selectCurrentBoxType = createSelector(selectCurrentBox, box => box.mime);
export const selectCurrentBoxContent = createSelector(selectCurrentBox, box => box.content);
