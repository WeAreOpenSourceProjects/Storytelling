import { PresentationsState, presentationsAdapter } from './presentations.interfaces';
import * as fromPresentations from './presentations.actions';
import { fromAuthentication } from '@labdat/authentication-state';
import { fromRouter } from '@labdat/router-state';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store'
import { fromSlides } from '@labdat/slides-state';

export const presentationsInitialState: PresentationsState = presentationsAdapter.getInitialState({
  currentPresentationId: null,
  loaded: false,
  loading: false,
  error: '',
  count :0
});

export function presentationsReducer(state: PresentationsState = presentationsInitialState, action: fromPresentations.Actions | fromAuthentication.Actions | RouterNavigationAction | fromSlides.Actions ): PresentationsState {
  switch (action.type) {
    case fromAuthentication.LOGOUT: {
      return presentationsInitialState;
    }
    case fromPresentations.SEARCH: {
      return presentationsAdapter.removeAll({ ...state, loading: true, loaded: false });
    }
    case fromPresentations.SEARCH_FAILURE: {
      return presentationsAdapter.removeAll({...state, error: action.payload.error, loading: false, loaded: false });
    }
    case fromPresentations.SEARCH_SUCCESS: {
      return presentationsAdapter.addMany(action.payload.presentations, { ...state, count :action.payload.presentationCount , loading: false, loaded: true });
    }
    case fromPresentations.GET_ONE: {
      return presentationsAdapter.removeAll({ ...state, loading: true, loaded: false });
    }
    case fromPresentations.GET_ONE_SUCCESS: {
      return presentationsAdapter.addOne(action.payload.presentation, { ...state, loading: false, loaded: true });
    }
    case fromPresentations.ADD_SUCCESS: {
      return presentationsAdapter.addOne(action.payload, { ...state, count : state.count +1});
    }
    case fromPresentations.COPY_SUCCESS: {
      return presentationsAdapter.addOne(action.payload, { ...state, count : state.count +1});
    }
    case fromPresentations.DELETE_SUCCESS: {
      return presentationsAdapter.removeOne(action.payload.presentationId, { ...state, count : state.count +1});
    }
    case fromPresentations.UPDATE_SUCCESS: {
      return presentationsAdapter.updateOne(action.payload, state);
    }
    case fromSlides.ADD_SUCCESS: {
      const presentationId = action.payload.presentationId;
      const slideIds = state.entities[presentationId].slideIds.slice();
      return presentationsAdapter.updateOne({ id: presentationId, changes: { slideIds:  slideIds.concat(action.payload._id) }}, state);
    }
    case fromSlides.DELETE_SUCCESS: {
      const presentationId = action.payload.slide.presentationId;
      const slideIds = state.entities[presentationId].slideIds.slice();
      return presentationsAdapter.updateOne({ id: presentationId, changes: { slideIds:  slideIds.filter(slideId => slideId !== action.payload.slide._id) }}, state);
    }
    case ROUTER_NAVIGATION: {
      const match = /\/presentations\/(.*)\/.*/.exec(action.payload.routerState.url);
      if (match) {
        return { ...state, currentPresentationId: match[1] };
      } else {
        return { ...state, currentPresentationId: state.currentPresentationId };;
      }
    }
    default: {
      return state;
    }
  }
}
