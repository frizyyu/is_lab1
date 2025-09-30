import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Group } from '../types/group.type';
import { of } from 'rxjs';
import { FormOfEducation } from '../enums/form-of-education.enum';
import { Semester } from '../enums/semester.enum';
import { Color } from '../enums/color.enum';
import { Country } from '../enums/country.enum';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = environment.API_BASE;
  private readonly http = inject(HttpClient)

  //впадлу мокать, я так захардкодил :)
  public getGroups() {
    const groups: Group[] = [
      {
        number: 1,
        name: 'qq',
        coordinates: {
          x: 2,
          y: 3,
        },
        creationDate: undefined,
        studentsCount: 4,
        expelledStudents: 5,
        transferredStudents: 6,
        formOfEducation: FormOfEducation.DISTANCE_EDUCATION,
        shouldBeExpelled: 7,
        semesterEnum: Semester.EIGHT,
        groupAdmin: {
          name: 'qqq',
          eyeColor: Color.BLUE,
          hairColor: Color.BLACK,
          location: {
            x: 8,
            y: 9,
            z: 10,
          },
          height: 8,
          nationality: Country.RUSSIA,
        },
      },
    ];

    return of<Group[]>(groups);
  }

    /*public getGroups() {
    return this.http.get<Group[]>(`${this.base}/groups`)
      .pipe(catchError((error: HttpErrorResponse) =>
        error.status === 421 ? throwError(error) : EMPTY
      ));
  }*/
}
