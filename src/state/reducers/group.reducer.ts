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
  pageMeta: {
    pageNumber: 0,
    size: 5,
    totalPages: 0,
    totalSize: 0,
  },
};

export const groupFeature = createFeature({
  name: groupFeatureKey,
  reducer: createReducer(
    initialGroupState,

    on(
      groupActions.loadSuccess,
      (state, { groups, pageMeta }): GroupState => ({
        ...state,
        groups: groups,
        pageMeta: pageMeta,
      }),
    ),
    on(
      groupActions.createDraft,
      (state): GroupState => ({
        ...state,
      }),
    ),
    on(groupActions.endEdit, (state, { group }) => ({
      ...state,
      groups: state.groups.map((d) => (d.id === group.id ? group : d)),
    })),
    on(groupActions.updateSuccess, (state, { groups }) => ({
      ...state,
      groups: state.groups.map((g) => groups.find((u) => u.id === g.id) ?? g),
    })),
    on(groupActions.deleteSuccess, (state, { ids }) => {
      const idsSet = new Set(ids ?? []);
      return {
        ...state,
        groups: state.groups.filter((d) => !idsSet.has(d.id)),
      };
    }),
    on(
      groupActions.loadStatsFetched,
      groupActions.autoUpdate,
      (state, { groups, avgShouldBeExpelled, minByExpelled, minByAdmin }) => {
        return {
          ...state,
          groups: groups,
          stats: {
            avgShouldBeExpelled: avgShouldBeExpelled ?? 0,
            minByExpelled: minByExpelled ?? state.stats.minByExpelled,
            minByAdmin: minByAdmin ?? [],
          },
        };
      },
    ),
    on(groupActions.groupsSortedByAdminFetched, (state, { groups }) => ({
      ...state,
      stats: {
        avgShouldBeExpelled: state.stats.avgShouldBeExpelled,
        minByExpelled: state.stats.minByExpelled,
        minByAdmin: groups ?? [],
      },
    })),
    on(groupActions.groupsSortedByAdminRequired, (state, { min }) => ({
      ...state,
      sortNum: min ?? 0,
    })),
  ),
});
