export { PresentationsStateModule } from './src/presentations-state.module'
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
