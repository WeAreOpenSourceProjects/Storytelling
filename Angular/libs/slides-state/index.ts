export { SlidesStateModule } from './src/slides-state.module';
export { SlidesState } from './src/+state/slides.interfaces';
import * as fromSlides from './src/+state/slides.actions';
export { fromSlides };
export {
  selectSlidesIds,
  selectSlidesEntities,
  selectAllSlides,
  selectSlidesTotal,
  selectSlidesLoading,
  selectSlidesLoaded,
  selectCurrentSlideId,
  selectCurrentSlide,
  selectCurrentSlideIndex,
  selectCurrentSlideBoxes
} from './src/+state/slides.selectors'
