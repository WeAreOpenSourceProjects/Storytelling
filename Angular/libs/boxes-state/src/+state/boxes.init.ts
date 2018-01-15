import { BoxesState, boxesAdapter } from './boxes.interfaces';

export const boxesInitialState: BoxesState = boxesAdapter.getInitialState({
  currentBoxId: null,
  loaded: false,
  loading: false
});
