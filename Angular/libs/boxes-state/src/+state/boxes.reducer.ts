import { BoxesState, boxesAdapter } from './boxes.interfaces';
import * as fromBoxes from './boxes.actions';
import { fromAuthentication } from '@labdat/authentication-state';
import * as fromPresentations from '@labdat/presentations-state/src/+state/presentations.actions';

export const boxesInitialState: BoxesState = boxesAdapter.getInitialState({
  currentBoxId: null,
  loaded: false,
  loading: false
});

export function boxesReducer(
  state: BoxesState = boxesInitialState,
  action: fromBoxes.Actions | fromAuthentication.Actions
): BoxesState {
  switch (action.type) {
    case fromAuthentication.LOGOUT: {
      return boxesInitialState;
    }
    case fromBoxes.LOAD: {
      return { ...state, loading: true };
    }
    case fromBoxes.LOAD_SUCCESS: {
      console.log('???????')
      return boxesAdapter.addAll(action.payload.boxes, { ...state, loaded: true, loading: false });
    }
    case fromBoxes.ADD_SUCCESS: {
      return boxesAdapter.addOne(action.payload.box, state);
    } 
    case fromBoxes.UPDATE_SUCCESS: {
      return boxesAdapter.updateOne(action.payload.box, state);
    }
    case fromBoxes.UPDATE_ALL_SUCCESS: {
      return boxesAdapter.updateMany(action.payload.boxes, state);
    }
    case fromBoxes.DELETE_SUCCESS: {
      console.log(action.payload);
      return boxesAdapter.removeOne(action.payload.boxId, state);
    }
    default: {
      return state;
    }
  }
}
