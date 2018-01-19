import { PresentationsState, presentationsAdapter } from './presentations.interfaces';
import * as fromPresentations from './presentations.actions';
import { fromAuthentication } from '@labdat/authentication-state';
import { fromRouter } from '@labdat/router-state';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store'

export const presentationsInitialState: PresentationsState = presentationsAdapter.getInitialState({
  currentPresentationId: null,
  loaded: false,
  loading: false,
  error: '',
});

export function presentationsReducer(state: PresentationsState = presentationsInitialState, action: fromPresentations.Actions | fromAuthentication.Actions | RouterNavigationAction ): PresentationsState {
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
    case ROUTER_NAVIGATION: {
      const match = /\/presentations\/(.*)\/*/.exec(action.payload.routerState.url);
      const currentPresentationId = match ? match[1] : null;
      return { ...state, currentPresentationId };
    }
    default: {
      return state;
    }
  }
}
