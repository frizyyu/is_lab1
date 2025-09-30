import { createSelector } from '@ngrx/store';
import { groupFeature } from '../reducers/group.reducer';

export const {
  selectGroups,
  selectDraftGroups,
} = groupFeature;