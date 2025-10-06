import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { groupActions } from '../actions/group.actions';
import { concatLatestFrom } from '@ngrx/operators';
import {
  catchError,
  defaultIfEmpty,
  EMPTY,
  forkJoin,
  interval,
  map,
  of,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
  timer,
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

export const onLoad$ = createEffect(
  (actions$ = inject(Actions), apiService$ = inject(ApiService)) => {
    return actions$.pipe(
      ofType(groupActions.load),
      switchMap(() =>
        interval(1000).pipe(
          startWith(0),
          switchMap(() => apiService$.getGroups().pipe(catchError(() => EMPTY))),
          take(1),
          map((groups) => groupActions.loadSuccess({ groups })),
          takeUntil(timer(10000)),
          defaultIfEmpty(groupActions.loadFailed({ error: 'EMPTY_RESPONSE' })),
        ),
      ),
    );
  },
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

export const autoPolling$ = createEffect(
  (actions$ = inject(Actions), store$ = inject(Store), api = inject(ApiService)) => {
    return actions$.pipe(
      ofType(rootActions.applicationStart, groupActions.autoUpdate, groupActions.autoUpdateFailed),
      switchMap(() =>
        timer(600, 600).pipe(
          concatLatestFrom(() => [store$.select(selectSortNum)]),
          switchMap(([, min]) =>
            forkJoin({
              groups: api.getGroups(),
              avgShouldBeExpelled: api.getAvgShouldBeExpelled(),
              minByExpelled: api.getMinByExpelledStudents(),
              minByAdmin: api.getGroupsByAdminHeightGreater(min),
            }).pipe(
              map(({ groups, avgShouldBeExpelled, minByExpelled, minByAdmin }) =>
                groupActions.autoUpdate({
                  groups,
                  avgShouldBeExpelled,
                  minByExpelled,
                  minByAdmin: minByAdmin,
                }),
              ),
              catchError(() => of(groupActions.autoUpdateFailed)),
            ),
          ),
        ),
      ),
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

export const reloadAfterAdd$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(groupActions.createSuccess),
      map(() => groupActions.load()),
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
      ofType(groupActions.createFailed),
      tap(({ error }) => {
        alerts
          .open(`Error while group creating: ${error.message}`, {
            label: 'Groups creation',
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
