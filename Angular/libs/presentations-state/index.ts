export { PresentationsStateModule } from './src/presentations-state.module';
import * as fromPresentations from './src/+state/presentations.actions';
export { fromPresentations }
export {
  selectPresentationsIds,
  selectPresentationsEntities,
  selectAllPresentations,
  selectPresentationsTotal,
  selectIsLoading,
  selectIsLoaded,
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
