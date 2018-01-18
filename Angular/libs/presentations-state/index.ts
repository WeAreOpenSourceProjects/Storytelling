export { PresentationsStateModule } from './src/presentations-state.module';
import * as fromPresentations from './src/+state/presentations.actions';
export { PresentationsApiService } from './src/services/presentations.api.service';
export { PresentationsState } from './src/+state/presentations.interfaces';
export { fromPresentations }
export {
  selectPresentationsIds,
  selectPresentationsEntities,
  selectAllPresentations,
  selectPresentationsTotal,
  selectPresentationsLoading,
  selectPresentationsLoaded,
  selectPresentationsError,
  selectCurrentPresentationId,
  selectCurrentPresentation,
  selectCurrentPresentationTitle,
  selectCurrentPresentationIsPublic,
  selectCurrentPresentationIsFavorite,
  selectCurrentPresentationDescription,
  selectCurrentPresentationTags,
  selectCurrentPresentationAuthorId,
  selectCurrentPresentationBanner,
  selectCurrentPresentationSlideIds,
  selectCurrentPresentationSlides,
} from './src/+state/presentations.selectors'
