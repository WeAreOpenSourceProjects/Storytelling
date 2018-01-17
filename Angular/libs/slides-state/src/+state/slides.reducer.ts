import { SlidesState, slidesAdapter } from './slides.interfaces';
import * as fromSlides from './slides.actions';
import { fromAuthentication } from '@labdat/authentication-state';
import * as fromPresentations from '@labdat/presentations-state/src/+state/presentations.actions';

export const slidesInitialState: SlidesState = slidesAdapter.getInitialState({
  currentSlideId: null,
  loaded: false,
  loading: false
});

export function slidesReducer(state: SlidesState = slidesInitialState, action: fromSlides.Actions | fromAuthentication.Actions | fromPresentations.Actions ) : SlidesState {
  switch (action.type) {
    case fromAuthentication.LOGOUT: {
      return slidesInitialState;
    }
    case fromSlides.LOAD: {
      return { ...state, loading: true };
    }
    case fromSlides.LOAD_SUCCESS: {
      return slidesAdapter.addAll(action.payload.slides, { ...state, loaded: true, loading: false });
    }
    case fromSlides.DELETE_SUCCESS: {
      return slidesAdapter.removeMany(action.payload.slideIds, state);
    }
    case fromPresentations.LOAD_SUCCESS:
    case fromPresentations.COPY_SUCCESS: {
      slidesAdapter.removeAll(state);
      return slidesAdapter.addMany(action.payload.slides, { ...state, loaded: true});
    }
    default: {
      return state;
    }
  }
}
