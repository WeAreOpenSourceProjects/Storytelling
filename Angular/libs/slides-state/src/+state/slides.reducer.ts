import { SlidesState, slidesAdapter } from './slides.interfaces';
import * as fromSlides from './slides.actions';
import { fromAuthentication } from '@labdat/authentication-state';
import { fromRouter } from '@labdat/router-state';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import * as fromPresentations from '@labdat/presentations-state/src/+state/presentations.actions';


export const slidesInitialState: SlidesState = slidesAdapter.getInitialState({
  currentPresentationId: null,
  currentSlideId: null,
  loaded: false,
  loading: false
});

export function slidesReducer(state: SlidesState = slidesInitialState, action: fromSlides.Actions | fromAuthentication.Actions | fromPresentations.Actions | RouterNavigationAction ) : SlidesState {
  switch (action.type) {
    case fromAuthentication.LOGOUT: {
      return slidesInitialState;
    }
    case fromSlides.DELETE_SUCCESS: {
      return slidesAdapter.removeOne(action.payload.slide.id, state);
    }
    case fromSlides.ADD_SUCCESS: {
      return slidesAdapter.addOne(action.payload, state);
    }
    case fromSlides.LOAD: {
      return slidesAdapter.removeAll({ ...state, loaded: false, loading: true });
    }
    case fromSlides.LOAD_SUCCESS: {
      return slidesAdapter.addMany(action.payload.slides, { ...state, loaded: true, loading: false });
    }
    case fromSlides.LOAD_SUCCESS: {
      return slidesAdapter.addMany(action.payload.slides, { ...state, loaded: true, loading: false });
    }
    case fromSlides.BULK_UPDATE_SUCCESS: {
      console.log('reducer', action.payload)
      return slidesAdapter.updateMany(action.payload, state);
    }
    case ROUTER_NAVIGATION: {
      let match, newState;
      match = /\/slides\/(.*)\/.*/.exec(action.payload.routerState.url);
      if (match) {
        newState = { ...state, currentSlideId: match[1] }
      }
      match = /\/presentations\/(.*)\/.*/.exec(action.payload.routerState.url);
      if (match) {
        newState = { ...state, currentPresentationId: match[1] }
      }
      return newState;
    }
    default: {
      return state;
    }
  }
}
