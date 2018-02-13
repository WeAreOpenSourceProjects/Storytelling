import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Presentation } from '@labdat/data-models';

export interface PresentationsState extends EntityState<Presentation> {
  currentPresentationId: string | null;
  loaded: boolean;
  loading: boolean;
  error: string;
  count: number
}
export const presentationsAdapter: EntityAdapter<Presentation> = createEntityAdapter<Presentation>();
