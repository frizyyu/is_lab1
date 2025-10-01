import { createFeature, createReducer, on } from '@ngrx/store';
import { groupActions, groupFeatureKey } from '../actions/group.actions';
import { GroupState } from '../interface/group-state.interface';

export const initialGroupState: GroupState = {
  groups: null,
  draftGroups: null,
}

export const groupFeature = createFeature({
  name: groupFeatureKey,
  reducer: createReducer(
    initialGroupState,
    on(
      groupActions.loadSuccess,
      (state, {groups}): GroupState => ({
        ...state,
        groups: groups,
        draftGroups: groups,
      })
    ),
    on(
      groupActions.createDraft,
      (state, {group}): GroupState => ({
        ...state,
        draftGroups: [...state.draftGroups, group],
      })
    ),
    on(groupActions.endEditDraft, (state, { group }) => ({
      ...state,
      draftGroups: state.draftGroups.map(d => d.number === group.number ? group : d),
    })),
  ),
});