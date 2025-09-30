import { Group } from '../../islab/types/group.type';

export interface GroupState {
  groups: Group[] | null;
  draftGroups: Group[] | null;
}