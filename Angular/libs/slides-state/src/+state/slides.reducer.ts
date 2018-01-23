import { SlidesState, slidesAdapter } from './slides.interfaces';
import * as fromSlides from './slides.actions';
import { fromAuthentication } from '@labdat/authentication-state';
import { fromRouter } from '@labdat/router-state';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import * as fromPresentations from '@labdat/presentations-state/src/+state/presentations.actions';


export const slidesInitialState: SlidesState = slidesAdapter.getInitialState({
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
      return slidesAdapter.removeOne(action.payload.id, state);
    }
    case fromSlides.ADD_SUCCESS: {
      return slidesAdapter.addOne(action.payload, state);
    }
    case ROUTER_NAVIGATION: {
      const match = /\/slides\/(.*)\/.*/.exec(action.payload.routerState.url);
      if (match) {
        return { ...state, currentSlideId: match[1] };
      } else {
        return { ...state, currentSlideId: state.currentSlideId };;
      }
    }
    default: {
      return state;
    }
  }
}
