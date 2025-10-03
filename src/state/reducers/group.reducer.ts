import { createFeature, createReducer, on } from '@ngrx/store';
import { groupActions, groupFeatureKey } from '../actions/group.actions';
import { GroupState } from '../interface/group-state.interface';

export const initialGroupState: GroupState = {
  groups: null,
  draftGroups: [],
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
      })
    ),
    on(
      groupActions.createDraft,
      (state, {group}): GroupState => ({
        ...state,
        draftGroups: [...state.draftGroups, group],
      })
    ),
    on(groupActions.endEdit, (state, { group }) => ({
      ...state,
      groups: state.groups.map(d => d.id === group.id ? group : d),
      draftGroups: state.draftGroups.map(d => d.draftId === group.draftId ? group : d),
    })),
    on(groupActions.createSuccess, (state, { groups }) => {
      const createdDraftIds = new Set(groups.map(g => g.draftId));

      return {
        ...state,
        draftGroups: state.draftGroups.filter(d => !createdDraftIds.has(d.draftId)),
      };
    }),
    on(groupActions.deleteSuccess, (state, { ids, draftIds }) => {
        const idsSet = new Set(ids);
        const draftIdsSet = new Set(draftIds);
        return {
          ...state,
          groups: state.groups.filter((d) => !idsSet.has(d.id)),
          draftGroups: state.draftGroups.filter(
            (d) => !draftIdsSet.has(d.draftId)
          ),
        };
    })
  ),
});