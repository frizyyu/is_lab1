import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Group } from '../../islab/types/group.type';
import { HttpErrorResponse } from '@angular/common/http';

export const groupFeatureKey = 'group';

export const groupActions = createActionGroup({
  source: groupFeatureKey,
  events: {
    load: emptyProps(),
    loadSuccess: props<{ groups: Group[] }>(),
    loadFailed: props<{ error: unknown }>(),

    create: props<{ groups: Group[] }>(),
    createSuccess: props<{ groups: Group[] }>(),
    createFailed: props<{ error: HttpErrorResponse | unknown }>(),
    createDraft: props<{ group: Group }>(),

    startEdit: props<{group: Group}>(),
    endEdit: props<{ group: Group }>(),

    update: props<{ id: number; changes: Omit<Group, 'id'> }>(),
    updateSuccess: props<{ group: Group }>(),
    updateFailed: props<{ error: unknown }>(),
    startUpdate: props<{group: Group}>(),

    delete: props<{ ids: number[], draftIds: number[] }>(),
    deleteSuccess: props<{ ids: number[], draftIds: number[] }>(),
    deleteFailed: props<{ error: HttpErrorResponse | unknown }>(),
  },
});
