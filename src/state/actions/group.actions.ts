import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Group } from '../../islab/types/group.type';

export const groupFeatureKey = 'group';

export const groupActions = createActionGroup({
  source: groupFeatureKey,
  events: {
    load: emptyProps(),
    loadSuccess: props<{ groups: Group[] }>(),
    loadFailed: props<{ error: unknown }>(),

    create: props<{ group: Omit<Group, 'id'> }>(),
    createSuccess: props<{ group: Group }>(),
    createFailed: props<{ error: unknown }>(),
    createDraft: props<{ group: Group }>(),

    update: props<{ id: number; changes: Omit<Group, 'id'> }>(),
    updateSuccess: props<{ group: Group }>(),
    updateFailed: props<{ error: unknown }>(),
    startUpdate: props<{group: Group}>(),

    delete: props<{ id: number }>(),
    deleteSuccess: props<{ id: number }>(),
    deleteFailed: props<{ error: unknown }>(),
  },
});
