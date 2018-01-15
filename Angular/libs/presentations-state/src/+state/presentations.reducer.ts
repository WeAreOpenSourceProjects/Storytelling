import { PresentationsState, presentationsAdapter } from './presentations.interfaces';
import * as fromPresentations from './presentations.actions';
import { fromAuthentication } from '@labdat/authentication-state';

export const presentationsInitialState: PresentationsState = presentationsAdapter.getInitialState({
  selectedPresentationId: null,
  loaded: false,
  loading: false,
  error: '',
});

export function presentationsReducer(state: PresentationsState = presentationsInitialState, action: fromPresentations.Actions | fromAuthentication.Actions): PresentationsState {
  switch (action.type) {
    case fromAuthentication.LOGOUT: {
      return presentationsInitialState;
    }
    case fromPresentations.LOAD: {
      return { ...state, loading: true };
    }
    case fromPresentations.LOAD_SUCCESS: {
      return presentationsAdapter.addAll(action.payload.presentations, { ...state, loaded: true, loading: false });
    }
    case fromPresentations.LOAD_FAILURE: {
      return presentationsAdapter.removeAll({...state, error: action.payload.error });
    }
    case fromPresentations.UPDATE_SUCCESS: {
      return presentationsAdapter.updateOne(action.payload, state);
    }
    default: {
      return state;
    }
  }
}
