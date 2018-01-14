import { PresentationsState, presentationsAdapter } from './presentations.interfaces';
import * as fromPresentations from './presentations.actions';
import { fromAuthentication } from '@labdat/authentication-state';

export const presentationsInitialState: PresentationsState = presentationsAdapter.getInitialState({
  selectedPresentationId: null,
  loaded: false,
  loading: false,
  error: null
});

export function presentationsReducer(state: PresentationsState = presentationsInitialState, action: fromPresentations.Actions | fromAuthentication.Actions): PresentationsState {
  switch (action.type) {
    case fromAuthentication.LOGOUT: {
      return presentationsInitialState;
    }
    case fromPresentations.LOAD: {
      return { ...state, loading: true, error: null };
    }
    case fromPresentations.LOAD_SUCCESS: {
      return presentationsAdapter.addAll(action.payload.presentations, { ...state, loaded: true, loading: false, error: null });
    }
    case fromPresentations.LOAD_FAILURE: {
      return presentationsAdapter.removeAll({...state, error: action.payload.error });
    }
    default: {
      return state;
    }
  }
}
