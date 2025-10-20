import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Group } from '../../islab/types/group.type';
import { HttpErrorResponse } from '@angular/common/http';

export const groupFeatureKey = 'group';

export const groupActions = createActionGroup({
  source: groupFeatureKey,
  events: {
    autoUpdate: props<{
      groups: Group[];
      avgShouldBeExpelled: number | null;
      minByExpelled: Group | null;
      minByAdmin: Group[] | null;
    }>(),
    autoUpdateFailed: emptyProps(),
    stopAutoUpdate: emptyProps(),

    load: props<{
      filter?: { key: string; value: string } | null;
      page?: number;
      size?: number;
      sort?: string;
    }>(),
    loadSuccess: props<{
      groups: Group[];
      pageMeta: { pageNumber: number; size: number; totalPages: number; totalSize: number };
    }>(),
    loadFailed: props<{ error: unknown }>(),

    create: props<{ groups: Group[] }>(),
    createSuccess: props<{ groups: Group[] }>(),
    createFailed: props<{ error: HttpErrorResponse | unknown }>(),
    createDraft: props<{ group: Group }>(),

    startEdit: props<{ group: Group }>(),
    endEdit: props<{ group: Group }>(),

    update: props<{ groups: Group[] }>(),
    updateSuccess: props<{ groups: Group[] }>(),
    updateFailed: props<{ error: unknown }>(),

    delete: props<{ ids: number[]; draftIds: number[] }>(),
    deleteSuccess: props<{ ids: number[]; draftIds: number[] }>(),
    deleteFailed: props<{ error: HttpErrorResponse | unknown }>(),

    loadStatsRequired: props<{ min: number }>(),
    loadStatsFetched: props<{
      groups: Group[];
      avgShouldBeExpelled: number | null;
      minByExpelled: Group | null;
      minByAdmin: Group[] | null;
    }>(),
    loadStatsFetchFailed: emptyProps(),

    expelButtonClicked: props<{ groupNum: number }>(),
    addStudentButtonClicked: props<{ groupNum: number }>(),
    groupsSortedByAdminRequired: props<{ min: number }>(),
    groupsSortedByAdminFetched: props<{ groups: Group[] }>(),
  },
});
