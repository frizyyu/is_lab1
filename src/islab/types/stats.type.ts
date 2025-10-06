import { Group } from './group.type';

export type Stats = {
  avgShouldBeExpelled: number;
  minByExpelled: Group;
  minByAdmin: Group[];
};
