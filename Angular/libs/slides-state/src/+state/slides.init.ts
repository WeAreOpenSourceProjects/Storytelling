import { SlidesState, slidesAdapter } from './slides.interfaces';
import { Slide } from '@labdat/data-models';


export const slidesInitialState: SlidesState = slidesAdapter.getInitialState({
  currentSlideId: null,
  loaded: false,
  loading: false
});
