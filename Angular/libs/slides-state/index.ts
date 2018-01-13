export { SlidesStateModule } from './src/slides-state.module';
import * as fromSlides from './src/+state/slides.actions';
export { fromSlides };
export {
  selectSlidesIds,
  selectSlidesEntities,
  selectAllSlides,
  selectSlidesTotal,
  selectIsLoading,
  selectIsLoaded,
  selectCurrentSlideId,
  selectCurrentSlide,
  selectCurrentSlideIndex,
  selectCurrentSlideBoxes
} from './src/+state/slides.selectors'
