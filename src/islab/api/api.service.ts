import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Group } from '../types/group.type';
import { catchError, EMPTY, map, Observable, of, throwError } from 'rxjs';
import { mapGroupsToBackendDto } from '../utils/dto-mappers';
import { AvgShouldResp } from '../types/avg-should-resp.type';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = environment.API_BASE;
  private readonly http = inject(HttpClient);

  public getGroups() {
    return this.http
      .get<Group[]>(`${this.base}/groups`)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          error.status === 421 ? throwError(error) : EMPTY,
        ),
      );
  }

  public createGroups(groups: Group[]): Observable<Group[]> {
    return this.http.post<Group[]>(`${this.base}/groups/batch`, mapGroupsToBackendDto(groups));
  }

  public deleteGroups(ids: number[]) {
    return this.http.request<void>('DELETE', `${this.base}/groups/batch`, {
      body: ids,
    });
  }

  public updateGroups(groups: Group[]): Observable<Group[]> {
    return this.http.put<Group[]>(`${this.base}/groups/batch`, mapGroupsToBackendDto(groups));
  }

  public getAvgShouldBeExpelled() {
    return this.http.get<AvgShouldResp>(`${this.base}/groups/stats/avg-should-be-expelled`).pipe(
      map((r) => r?.avgShouldBeExpelled ?? null),
      catchError(() => of(null)),
    );
  }

  public getMinByExpelledStudents() {
    return this.http
      .get<Group | null>(`${this.base}/groups/stats/min-expelled-students`, { observe: 'body' })
      .pipe(
        map((g) => g ?? null),
        catchError(() => of(null)),
      );
  }

  public expelAllStudents(id: number) {
    return this.http
      .put<Group>(`${this.base}/groups/${id}/expel-all`, {}, { observe: 'body' })
      .pipe(catchError((error) => throwError(() => error)));
  }

  public addStudent(id: number) {
    return this.http
      .put<Group>(`${this.base}/groups/${id}/add-student`, {}, { observe: 'body' })
      .pipe(catchError((error) => throwError(() => error)));
  }

  public getGroupsByAdminHeightGreater(min: number) {
    return this.http
      .get<Group[]>(`${this.base}/groups/stats/admin-height-greater/${min}`)
      .pipe(catchError(() => of([])));
  }
}
