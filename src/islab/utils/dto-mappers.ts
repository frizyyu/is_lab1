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

function toIsoOrNull(v): string | null {
  if (!v) return null;

  if (v instanceof Date || typeof v === 'string') {
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }

  if (Array.isArray(v)) {
    const [y, m, d, H, M, S, nanos] = v;
    const ms = (nanos ?? 0) / 1e6;
    const date = new Date(y, (m ?? 1) - 1, d ?? 1, H ?? 0, M ?? 0, S ?? 0, ms);
    return date.toISOString();
  }

  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

export function mapGroupToBackendDto(g: Group) {
  return {
    id: g.id,
    name: g.name,
    coordinates: {
      x: g.coordinates?.x ?? null,
      y: g.coordinates?.y ?? null,
    },
    creationDate: toIsoOrNull(g.creationDate),
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
