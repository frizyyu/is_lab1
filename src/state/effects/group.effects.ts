import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { groupActions } from '../actions/group.actions';
import { concatLatestFrom } from '@ngrx/operators';
import {
  catchError,
  distinctUntilChanged,
  EMPTY,
  finalize,
  forkJoin,
  map,
  of,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { ApiService } from '../../islab/api/api.service';
import { routerActions } from '../actions/router.actions';
import { TuiAlertOptions, TuiAlertService } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { TuiPopover } from '@taiga-ui/cdk';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { selectSortNum } from '../selectors/group.selector';
import { rootActions } from '../actions/root.actions';
import { GroupsWsService } from '../../islab/feat/services/groups-ws.service';

let latestFilter: { key: string; value: string } | null = null;
let latestSort = null;
let reloadInFlight = false;

export const rememberFilter$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(groupActions.load),
      tap(({ filter, sort }) => {
        latestFilter =
          filter?.key && filter.value?.trim()
            ? { key: filter.key, value: filter.value.trim() }
            : null;
        latestSort = sort ?? 'id';
        reloadInFlight = true;
      }),
    ),
  { functional: true, dispatch: false },
);

export const clearInFlightOnLoadDone$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(groupActions.loadSuccess, groupActions.loadFailed),
      tap(() => {
        reloadInFlight = false;
      }),
    ),
  { functional: true, dispatch: false },
);

export const respectFilterOnWs$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(groupActions.autoUpdate),
      map(({ groups }) => sigOf(groups)),
      distinctUntilChanged(),
      switchMap(() => {
        if (reloadInFlight) return EMPTY;
        reloadInFlight = true;
        return of(
          groupActions.load({
            filter: latestFilter,
            page: 0,
            size: 5,
            sort: latestSort,
          }),
        );
      }),
    ),
  { functional: true },
);

const sigOf = (arr: any[] | null | undefined) =>
  (arr ?? [])
    .map((g) =>
      [
        g.id ?? `d:${g.draftId}`,
        g.name,
        g.studentsCount,
        g.expelledStudents,
        g.transferredStudents,
        g.shouldBeExpelled,
        g.semesterEnum,
        g.formOfEducation,
        g.groupAdmin?.height,
        g.groupAdmin?.name,
      ].join('~'),
    )
    .join('|');

export const liveUpdates$ = createEffect(
  (actions$ = inject(Actions), ws = inject(GroupsWsService)) => {
    const stop$ = actions$.pipe(ofType(groupActions.stopAutoUpdate));

    return actions$.pipe(
      ofType(rootActions.applicationStart),
      take(1),
      switchMap(() =>
        ws.connect().pipe(
          distinctUntilChanged((a, b) => sigOf(a.groups) === sigOf(b.groups)),
          map((p) =>
            groupActions.autoUpdate({
              groups: p.groups ?? [],
              avgShouldBeExpelled: p.avgShouldBeExpelled ?? null,
              minByExpelled: p.minByExpelled ?? null,
              minByAdmin: p.minByAdmin ?? [],
            }),
          ),
          takeUntil(stop$),
          finalize(() => ws.close()),
          catchError(() => of(groupActions.autoUpdateFailed())),
        ),
      ),
    );
  },
  { functional: true },
);

export const loadGroups$ = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(groupActions.load),
      switchMap(({ filter, page = 0, size = 20, sort = '' }) =>
        api.getGroupsPage({ filter: filter ?? undefined, page, size, sort }).pipe(
          map((resp) =>
            groupActions.loadSuccess({
              groups: resp?.content ?? [],
              pageMeta: {
                pageNumber: resp?.pageNumber ?? 0,
                size: resp?.size ?? size,
                totalPages: resp?.totalPages ?? 0,
                totalSize: resp?.totalSize ?? 0,
              },
            }),
          ),
          catchError((error) => of(groupActions.loadFailed({ error }))),
        ),
      ),
    ),
  { functional: true },
);

export const onLoadFailed$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(groupActions.loadFailed),
      map(() => routerActions.navigateToErrorPage()),
    );
  },
  { functional: true },
);

export const onLoadSuccess$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(groupActions.loadSuccess),
      map(() => routerActions.navigateToGroupListPage()),
    );
  },
  { functional: true },
);

export class AlertExample {
  protected readonly context = injectContext<TuiPopover<TuiAlertOptions<void>, boolean>>();
}

export const onCreateDraft$ = createEffect(
  (actions$ = inject(Actions), alerts = inject(TuiAlertService)) => {
    return actions$.pipe(
      ofType(groupActions.createDraft),
      tap(() => {
        alerts
          .open(`Created new draft`, {
            label: 'Draft creation',
            autoClose: 5000,
          })
          .subscribe();
      }),
    );
  },
  { functional: true, dispatch: false },
);

export const createGroups$ = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) => {
    return actions$.pipe(
      ofType(groupActions.create),
      switchMap(({ groups }) =>
        api.createGroups(groups).pipe(
          map(() => groupActions.createSuccess({ groups })),
          catchError((error: HttpErrorResponse) => of(groupActions.createFailed({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const updateGroups$ = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) => {
    return actions$.pipe(
      ofType(groupActions.update),
      switchMap(({ groups }) =>
        api.updateGroups(groups).pipe(
          map(() => groupActions.updateSuccess({ groups })),
          catchError((error: HttpErrorResponse) => of(groupActions.updateFailed({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const notifyCreateSuccess$ = createEffect(
  (actions$ = inject(Actions), alerts = inject(TuiAlertService)) => {
    return actions$.pipe(
      ofType(groupActions.createSuccess),
      tap(() => {
        alerts
          .open(`Group(s) created`, {
            label: 'Groups creation',
            autoClose: 5000,
          })
          .subscribe();
      }),
    );
  },
  { functional: true, dispatch: false },
);

export const notifyCreateFailure$ = createEffect(
  (actions$ = inject(Actions), alerts = inject(TuiAlertService)) => {
    return actions$.pipe(
      ofType(groupActions.createFailed, groupActions.updateFailed),
      tap(() => {
        alerts
          .open(`Server responsed with error. Check fields`, {
            label: 'Error',
            autoClose: 5000,
          })
          .subscribe();
      }),
    );
  },
  { functional: true, dispatch: false },
);

export const deleteGroups$ = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) => {
    return actions$.pipe(
      ofType(groupActions.delete),
      switchMap(({ ids, draftIds }) =>
        api.deleteGroups(ids).pipe(
          map(() => groupActions.deleteSuccess({ ids, draftIds })),
          catchError((error: HttpErrorResponse) => of(groupActions.deleteFailed({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const notifyDeleteSuccess$ = createEffect(
  (actions$ = inject(Actions), alerts = inject(TuiAlertService)) => {
    return actions$.pipe(
      ofType(groupActions.deleteSuccess),
      tap(() => {
        alerts
          .open(`Group(s) deleted`, {
            label: 'Groups deletion',
            autoClose: 5000,
          })
          .subscribe();
      }),
    );
  },
  { functional: true, dispatch: false },
);

export const notifyDeleteFailure$ = createEffect(
  (actions$ = inject(Actions), alerts = inject(TuiAlertService)) => {
    return actions$.pipe(
      ofType(groupActions.deleteFailed),
      tap(({ error }) => {
        alerts
          .open(`Error while groups deleting: ${error.message}`, {
            label: 'Groups deletion',
            autoClose: 5000,
          })
          .subscribe();
      }),
    );
  },
  { functional: true, dispatch: false },
);

export const loadStats$ = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) => {
    return actions$.pipe(
      ofType(groupActions.loadStatsRequired),
      switchMap(({ min }) =>
        forkJoin({
          groups: api.getGroups(),
          avg: api.getAvgShouldBeExpelled(),
          minGroup: api.getMinByExpelledStudents(),
          minByAdmin: api.getGroupsByAdminHeightGreater(min),
        }).pipe(
          map(({ groups, avg, minGroup, minByAdmin }) =>
            groupActions.loadStatsFetched({
              groups: groups,
              avgShouldBeExpelled: avg,
              minByExpelled: minGroup,
              minByAdmin: minByAdmin,
            }),
          ),
          catchError(() => of(groupActions.loadStatsFetchFailed())),
        ),
      ),
    );
  },
  { functional: true },
);

export const onGroupsSortedByAdminRequired$ = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) => {
    return actions$.pipe(
      ofType(groupActions.groupsSortedByAdminRequired),
      switchMap(({ min }) =>
        api.getGroupsByAdminHeightGreater(min).pipe(
          map((groups) => groupActions.groupsSortedByAdminFetched({ groups })),
          catchError(() => EMPTY),
        ),
      ),
    );
  },
  { functional: true },
);

export const onLoadStatsSuccess$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(groupActions.loadStatsRequired),
      map(() => routerActions.navigateToStatsPage()),
    );
  },
  { functional: true },
);

export const onExpelButtonClicked$ = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) => {
    return actions$.pipe(
      ofType(groupActions.expelButtonClicked),
      switchMap(({ groupNum }) =>
        api.expelAllStudents(groupNum).pipe(
          map((groups) => groupActions.updateSuccess({ groups: [groups] })),
          catchError((error) => of(groupActions.updateFailed({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const onAddStudentButtonClicked$ = createEffect(
  (actions$ = inject(Actions), api = inject(ApiService)) => {
    return actions$.pipe(
      ofType(groupActions.addStudentButtonClicked),
      switchMap(({ groupNum }) =>
        api.addStudent(groupNum).pipe(
          map((groups) => groupActions.updateSuccess({ groups: [groups] })),
          catchError((error) => of(groupActions.updateFailed({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const onUpdateSuccess$ = createEffect(
  (
    actions$ = inject(Actions),
    store$ = inject(Store),
    api = inject(ApiService),
    alerts = inject(TuiAlertService),
  ) => {
    return actions$.pipe(
      ofType(groupActions.updateSuccess),
      concatLatestFrom(() => [store$.select(selectSortNum)]),
      tap(() => {
        alerts
          .open(`Successful updated`, {
            label: 'Update info',
            autoClose: 5000,
          })
          .subscribe();
      }),
      switchMap(([, min]) =>
        forkJoin({
          groups: api.getGroups(),
          avg: api.getAvgShouldBeExpelled(),
          minGroup: api.getMinByExpelledStudents(),
          minByAdmin: api.getGroupsByAdminHeightGreater(min),
        }).pipe(
          map(({ groups, avg, minGroup, minByAdmin }) =>
            groupActions.loadStatsFetched({
              groups: groups,
              avgShouldBeExpelled: avg,
              minByExpelled: minGroup,
              minByAdmin: minByAdmin,
            }),
          ),
          catchError(() => of(groupActions.loadStatsFetchFailed())),
        ),
      ),
    );
  },
  { functional: true },
);

export const loadStatsFailed$ = createEffect(
  (actions$ = inject(Actions), store$ = inject(Store)) => {
    return actions$.pipe(
      ofType(groupActions.loadStatsFetchFailed),
      map(() => store$.dispatch(routerActions.navigateToErrorPage())),
    );
  },
  { functional: true, dispatch: false },
);
