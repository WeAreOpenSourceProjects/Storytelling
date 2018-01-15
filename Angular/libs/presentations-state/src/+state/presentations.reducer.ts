import { PresentationsState, presentationsAdapter } from './presentations.interfaces';
import * as fromPresentations from './presentations.actions';
import { fromAuthentication } from '@labdat/authentication-state';

export const presentationsInitialState: PresentationsState = presentationsAdapter.getInitialState({
  selectedPresentationId: null,
  loaded: false,
  loading: false
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
    default: {
      return state;
    }
  }
}
