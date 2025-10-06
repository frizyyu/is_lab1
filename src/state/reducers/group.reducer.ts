import { createFeature, createReducer, on } from '@ngrx/store';
import { groupActions, groupFeatureKey } from '../actions/group.actions';
import { GroupState } from '../interface/group-state.interface';
import { FormOfEducation } from '../../islab/enums/form-of-education.enum';
import { Semester } from '../../islab/enums/semester.enum';
import { Color } from '../../islab/enums/color.enum';
import { Country } from '../../islab/enums/country.enum';

export const initialGroupState: GroupState = {
  groups: [],
  draftGroups: [],
  stats: {
    avgShouldBeExpelled: 0,
    minByExpelled: {
      draftId: 0,
      id: 0,
      name: '',
      coordinates: {
        x: 0,
        y: 0,
      },
      creationDate: undefined,
      studentsCount: 0,
      expelledStudents: 0,
      transferredStudents: 0,
      formOfEducation: FormOfEducation.DISTANCE_EDUCATION,
      shouldBeExpelled: 0,
      semesterEnum: Semester.FIRST,
      groupAdmin: {
        name: '',
        eyeColor: Color.RED,
        hairColor: Color.RED,
        location: {
          x: 0,
          y: 0,
          z: 0,
        },
        height: 0,
        nationality: Country.RUSSIA,
      },
    },
    minByAdmin: [],
  },
  sortNum: 0,
};

export const groupFeature = createFeature({
  name: groupFeatureKey,
  reducer: createReducer(
    initialGroupState,
    on(
      groupActions.loadSuccess,
      (state, { groups }): GroupState => ({
        ...state,
        groups: groups,
      }),
    ),
    on(
      groupActions.createDraft,
      (state, { group }): GroupState => ({
        ...state,
        draftGroups: [...state.draftGroups, group],
      }),
    ),
    on(groupActions.endEdit, (state, { group }) => ({
      ...state,
      groups: state.groups.map((d) => (d.id === group.id ? group : d)),
      draftGroups: state.draftGroups.map((d) => (d.draftId === group.draftId ? group : d)),
    })),
    on(groupActions.updateSuccess, groupActions.autoUpdate, (state, { groups }) => ({
      ...state,
      groups: state.groups.map((g) => groups.find((u) => u.id === g.id) ?? g),
    })),
    on(groupActions.createSuccess, (state, { groups }) => {
      const createdDraftIds = new Set(groups.map((g) => g.draftId));

      return {
        ...state,
        draftGroups: state.draftGroups.filter((d) => !createdDraftIds.has(d.draftId)),
      };
    }),
    on(groupActions.deleteSuccess, (state, { ids, draftIds }) => {
      const idsSet = new Set(ids);
      const draftIdsSet = new Set(draftIds);
      return {
        ...state,
        groups: state.groups.filter((d) => !idsSet.has(d.id)),
        draftGroups: state.draftGroups.filter((d) => !draftIdsSet.has(d.draftId)),
      };
    }),
    on(
      groupActions.loadStatsFetched,
      groupActions.autoUpdate,
      (state, { groups, avgShouldBeExpelled, minByExpelled, minByAdmin }) => ({
        ...state,
        groups: groups,
        stats: { avgShouldBeExpelled, minByExpelled, minByAdmin: minByAdmin },
      }),
    ),
    on(groupActions.groupsSortedByAdminFetched, (state, { groups }) => ({
      ...state,
      stats: {
        avgShouldBeExpelled: state.stats.avgShouldBeExpelled,
        minByExpelled: state.stats.minByExpelled,
        minByAdmin: groups,
      },
    })),

    on(groupActions.groupsSortedByAdminRequired, (state, { min }) => ({
      ...state,
      sortNum: min,
    })),
  ),
});
