import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Group } from '../types/group.type';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { mapGroupsToBackendDto } from '../utils/dto-mappers';
import { AvgShouldResp } from '../types/avg-should-resp.type';
import { PageResponse } from '../types/page.type';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = environment.API_BASE;
  private readonly http = inject(HttpClient);

  getGroupsPage(opts?: {
    filter?: { key: string; value: string };
    page?: number;
    size?: number;
    sort?: string;
  }) {
    let params = new HttpParams()
      .set('page', String(opts?.page ?? 0))
      .set('size', String(opts?.size ?? 20));
    if (opts?.sort) params = params.set('sort', opts.sort);
    const f = opts?.filter;
    if (f?.key && f.value?.trim()) {
      params = params.set('filterKey', f.key).set('filterValue', f.value.trim());
    }
    return this.http.get<PageResponse<Group>>(`/api/groups`, { params });
  }

  getGroups(opts?: {
    filter?: { key: string; value: string };
    page?: number;
    size?: number;
    sort?: string;
  }) {
    return this.getGroupsPage(opts).pipe(map((p) => p?.content ?? []));
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
    return this.http.get<AvgShouldResp>(`${this.base}/groups/stats/avg/should/be/expelled`).pipe(
      map((r) => r?.avgShouldBeExpelled ?? null),
      catchError(() => of(null)),
    );
  }

  public getMinByExpelledStudents() {
    return this.http
      .get<Group | null>(`${this.base}/groups/stats/min/expelled/students`, { observe: 'body' })
      .pipe(
        map((g) => g ?? null),
        catchError(() => of(null)),
      );
  }

  public expelAllStudents(id: number) {
    return this.http
      .put<Group>(`${this.base}/groups/${id}/expel/all`, {}, { observe: 'body' })
      .pipe(catchError((error) => throwError(() => error)));
  }

  public addStudent(id: number) {
    return this.http
      .put<Group>(`${this.base}/groups/${id}/add/student`, {}, { observe: 'body' })
      .pipe(catchError((error) => throwError(() => error)));
  }

  public getGroupsByAdminHeightGreater(min: number) {
    return this.http
      .get<Group[]>(`${this.base}/groups/stats/admin/height/greater/${min}`)
      .pipe(catchError(() => of([])));
  }
}
