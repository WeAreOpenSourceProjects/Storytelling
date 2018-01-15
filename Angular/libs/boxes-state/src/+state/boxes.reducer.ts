import { BoxesState, boxesAdapter } from './boxes.interfaces';
import * as fromBoxes from './boxes.actions';
import { fromAuthentication } from '@labdat/authentication-state';

export const boxesInitialState: BoxesState = boxesAdapter.getInitialState({
  currentBoxId: null,
  loaded: false,
  loading: false
});

export function boxesReducer(state: BoxesState = boxesInitialState, action: fromBoxes.Actions | fromAuthentication.Actions): BoxesState {
  switch (action.type) {
    case fromAuthentication.LOGOUT: {
      return boxesInitialState;
    }
    case fromBoxes.LOAD: {
      return { ...state, loading: true };
    }
    case fromBoxes.LOAD_SUCCESS: {
      return boxesAdapter.addAll(action.payload.boxes, { ...state, loaded: true, loading: false });
    }
    default: {
      return state;
    }
  }
}
