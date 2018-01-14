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
  selectPresentationsIsLoading,
  selectPresentationsIsLoaded,
  selectPresentationsError,
  selectedPresentationId,
  selectSelectedPresentation,
  selectCurrentPresentationTitle,
  selectCurrentPresentationIsPublic,
  selectCurrentPresentationIsFavorite,
  selectCurrentPresentationDescription,
  selectCurrentPresentationTags,
  selectCurrentPresentationAuthor,
  selectCurrentPresentationBanner,
  selectCurrentPresentationSlides
} from './src/+state/presentations.selectors'
