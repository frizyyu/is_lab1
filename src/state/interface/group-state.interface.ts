import { Group } from '../../islab/types/group.type';
import { Stats } from '../../islab/types/stats.type';

export interface GroupState {
  groups: Group[] | null;
  draftGroups: Group[];
  stats: Stats;
  sortNum: number;
  pageMeta: {
    pageNumber: number;
    size: number;
    totalPages: number;
    totalSize: number;
  };
}
