import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Slide } from '@labdat/data-models';

export interface SlidesState extends EntityState<Slide> {
  currentPresentationId: string | null;
  currentSlideId: string | null;
  loaded: boolean;
  loading: boolean;
}

export function sortByIndex(a: Slide, b: Slide): number {
  return a.index - b.index;
}

export const slidesAdapter: EntityAdapter<Slide> = createEntityAdapter<Slide>({
  sortComparer: sortByIndex,
  selectId: (slide: Slide) => slide._id
});

