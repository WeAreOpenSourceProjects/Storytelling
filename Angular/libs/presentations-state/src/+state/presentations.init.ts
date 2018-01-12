import { PresentationsState, presentationsAdapter } from './presentations.interfaces';
import { Presentation } from '@labdat/data-models';


export const presentationsInitialState: PresentationsState = presentationsAdapter.getInitialState({
  loaded: false,
  loading: false
});
