import { Coordinates } from './coordinates.type';
import { FormOfEducation } from '../enums/form-of-education.enum';
import { Semester } from '../enums/semester.enum';
import { Person } from './person.type';

export type Group = {
  draftId: number;
  id: number;
  name: string;
  coordinates: Coordinates;
  creationDate: Date;
  studentsCount: number;
  expelledStudents: number;
  transferredStudents: number;
  formOfEducation: FormOfEducation;
  shouldBeExpelled: number;
  semesterEnum: Semester;
  groupAdmin: Person;
};
