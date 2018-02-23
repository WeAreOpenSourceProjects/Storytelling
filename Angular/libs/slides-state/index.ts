export { SlidesStateModule } from './src/slides-state.module';
export { SlidesState } from './src/+state/slides.interfaces';
import * as fromSlides from './src/+state/slides.actions';
export { SlidesApiService } from './src/services/slides.api.service';
export { fromSlides };
export {
  selectCurrentPresentationId,
  selectSlideIds,
  selectSlideEntities,
  selectAllSlides,
  selectSlidesTotal,
  selectSlidesLoading,
  selectSlidesLoaded,
  selectCurrentSlideId,
  selectCurrentSlide,
  selectCurrentSlideIndex,
  selectCurrentSlideBoxes
} from './src/+state/slides.selectors';
