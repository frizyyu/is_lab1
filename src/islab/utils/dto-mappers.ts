import { Group } from '../types/group.type';
import { FormOfEducation } from '../enums/form-of-education.enum';
import { Semester } from '../enums/semester.enum';
import { Color } from '../enums/color.enum';
import { Country } from '../enums/country.enum';

type EnumLike = Record<string | number, string | number>;

function enumToName<T extends EnumLike>(e: T, value: number | string | undefined | null) {
  if (value === undefined || value === null) return value;
  return typeof value === 'number' ? e[value] : value;
}

export function mapGroupToBackendDto(g: Group) {
  return {
    number: g.id,
    name: g.name,
    coordinates: {
      x: g.coordinates?.x ?? null,
      y: g.coordinates?.y ?? null,
    },
    creationDate: g.creationDate ?? null,
    studentsCount: g.studentsCount ?? null,
    expelledStudents: g.expelledStudents ?? null,
    transferredStudents: g.transferredStudents ?? null,

    formOfEducation: enumToName(FormOfEducation, g.formOfEducation),
    shouldBeExpelled: g.shouldBeExpelled ?? null,
    semesterEnum: enumToName(Semester, g.semesterEnum),

    groupAdmin: g.groupAdmin
      ? {
        name: g.groupAdmin.name ?? null,
        height: g.groupAdmin.height ?? null,
        eyeColor: enumToName(Color, g.groupAdmin.eyeColor),
        hairColor: enumToName(Color, g.groupAdmin.hairColor),
        nationality: enumToName(Country, g.groupAdmin.nationality),
        location: g.groupAdmin.location
          ? {
            x: g.groupAdmin.location.x ?? null,
            y: g.groupAdmin.location.y ?? null,
            z: g.groupAdmin.location.z ?? null,
          }
          : null,
      }
      : null,
  };
}

export function mapGroupsToBackendDto(groups: Group[]) {
  return groups.map(mapGroupToBackendDto);
}
