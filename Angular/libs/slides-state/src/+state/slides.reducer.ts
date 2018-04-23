import { SlidesState, slidesAdapter } from './slides.interfaces';
import * as fromSlides from './slides.actions';
import { fromAuthentication } from '@labdat/authentication-state';
import { fromRouter } from '@labdat/router-state';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import * as fromPresentations from '@labdat/presentations-state/src/+state/presentations.actions';
import { deepClone } from 'lodash';
import { fromBoxes } from '@labdat/boxes-state';

export const slidesInitialState: SlidesState = slidesAdapter.getInitialState({
  currentPresentationId: null,
  currentSlideId: null,
  loaded: false,
  loading: false
});

export function slidesReducer(
  state: SlidesState = slidesInitialState,
  action: fromSlides.Actions | fromAuthentication.Actions | fromPresentations.Actions | RouterNavigationAction | fromBoxes.Actions
): SlidesState {
  switch (action.type) {
    case fromAuthentication.LOGOUT: {
      return slidesInitialState;
    }
    case fromSlides.DELETE_SUCCESS: {
      return slidesAdapter.removeOne(action.payload.slide.id, state);
    }
    case fromSlides.UPDATE_ON_DELETE: {
      const index = Array.prototype.findIndex.call(state.ids, id => id === action.payload.slide.id);
      const slideIds = Array.prototype.slice.call(state.ids, index + 1);
      const slides = slideIds.map(slideId => state.entities[slideId]);
      const updates = slides.map(slide => ({ id: slide.id, changes: { index: slide.index - 1 } }));
      console.log(updates);
      return slidesAdapter.updateMany(updates, state);
    }
    case fromBoxes.ADD_SUCCESS: {
      return slidesAdapter.updateOne({
        id: action.payload.box.slideId,
        changes: Object.assign(
          {},
          state.entities[action.payload.box.slideId],
          { boxIds: state.entities[action.payload.box.slideId].boxIds.concat([ action.payload.box ]) }
        )
      },
      state)
    }

    case fromSlides.UPDATE_STATE: {
      return slidesAdapter.updateOne({
        id: action.payload.slide.id,
        changes: action.payload.slide.changes
      },
      state)
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
    case fromSlides.UPDATE: {
      return slidesAdapter.updateOne(action.payload.slide, { ...state, loaded: true, loading: false });
    } 
    case fromSlides.UPDATE_SUCCESS: {
      return slidesAdapter.updateOne({
        id: action.payload.slide._id,
        changes: action.payload.slide
      },
      state);
    } 

    case fromSlides.BULK_UPDATE_SUCCESS: {
      return slidesAdapter.updateMany(action.payload, state);
    }

    case fromSlides.LOAD_ONE : {
      return slidesAdapter.removeAll({ ...state, loaded: false, loading: true });
    }
    case fromSlides.LOAD_ONE_SUCCESS: {
      return slidesAdapter.addOne(action.payload.slide, { ...state, loaded: true, loading: false });
    }
    
    case ROUTER_NAVIGATION: {
      let match;
      match = /\/slides\/(.*)/.exec(action.payload.routerState.url);
      if (match) {
        return { ...state, currentSlideId: match[1] };
      }
      match = /\/presentations\/(.*)\/.*/.exec(action.payload.routerState.url);
      if (match) {
        return { ...state, currentPresentationId: match[1] };
      }
      return state;
    }
    default: {
      return state;
    }
  }
}
