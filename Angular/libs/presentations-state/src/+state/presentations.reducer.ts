import { PresentationsState, presentationsAdapter } from './presentations.interfaces';
import * as fromPresentations from './presentations.actions';
import { fromAuthentication } from '@labdat/authentication-state';

export const presentationsInitialState: PresentationsState = presentationsAdapter.getInitialState({
  currentPresentationId: null,
  loaded: false,
  loading: false,
  error: '',
});

export function presentationsReducer(state: PresentationsState = presentationsInitialState, action: fromPresentations.Actions | fromAuthentication.Actions ): PresentationsState {
  switch (action.type) {
    case fromAuthentication.LOGOUT: {
      return presentationsInitialState;
    }
    case fromPresentations.LOAD: {
      return { ...state, loading: true };
    }
    case fromPresentations.LOAD_FAILURE: {
      return presentationsAdapter.removeAll({...state, error: action.payload.error });
    }
    case fromPresentations.LOAD_SUCCESS: {
      return presentationsAdapter.addAll(action.payload.presentations, { ...state, loaded: true, loading: false });
    }
    case fromPresentations.ADD_SUCCESS: {
      return presentationsAdapter.addOne(action.payload, state);
    }
    case fromPresentations.COPY_SUCCESS: {
      return presentationsAdapter.addOne(action.payload.presentation, state);
    }
    case fromPresentations.DELETE_SUCCESS: {
      return presentationsAdapter.removeOne(action.payload.presentationId, state);
    }
    case fromPresentations.UPDATE_SUCCESS: {
      return presentationsAdapter.updateOne(action.payload, state);
    }
    case fromPresentations.SELECT: {
      return { ...state, currentPresentationId: action.payload };
    }
    default: {
      return state;
    }
  }
}
