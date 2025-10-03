import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { groupActions } from '../actions/group.actions';
import {
  catchError,
  defaultIfEmpty,
  EMPTY,
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
import {
  TuiAlertOptions,
  TuiAlertService,
} from '@taiga-ui/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import { TuiPopover } from '@taiga-ui/cdk';
import { HttpErrorResponse } from '@angular/common/http';

export const onLoad$ = createEffect(
  (actions$ = inject(Actions), apiService$ = inject(ApiService)) => {
    return actions$.pipe(
      ofType(groupActions.load),
      switchMap(() =>
        interval(1000).pipe(
          startWith(0),
          switchMap(() =>
            apiService$.getGroups().pipe(
              catchError(() => EMPTY)
            )
          ),
          take(1),
          map((groups) => groupActions.loadSuccess({groups})),
          takeUntil(timer(10000)),
          defaultIfEmpty(groupActions.loadFailed({error: 'EMPTY_RESPONSE'})),
        )
      )
    )
  },
  {functional: true}
);

export const onLoadFailed$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(groupActions.loadFailed),
      map(() => routerActions.navigateToErrorPage())
    )
  },
  {functional: true}
);

export const onLoadSuccess$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(groupActions.loadSuccess),
      map(() => routerActions.navigateToGroupListPage())
    )
  },
  {functional: true}
);

export class AlertExample {
  protected readonly context =
    injectContext<TuiPopover<TuiAlertOptions<void>, boolean>>();
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
      })
    )
  },
  {functional: true, dispatch: false}
);

export const createGroups$ = createEffect(
  (
    actions$ = inject(Actions),
    api = inject(ApiService),
  ) => {
    return actions$.pipe(
      ofType(groupActions.create),
      switchMap(({ groups }) =>
        api.createGroups(groups).pipe(
          map(() => groupActions.createSuccess({groups})),
          catchError((error: HttpErrorResponse) =>
            of(groupActions.createFailed({ error }))
          )
        )
      )
    );
  },
  { functional: true }
);

export const reloadAfterAdd$ = createEffect(
  (
    actions$ = inject(Actions),
  ) => {
    return actions$.pipe(
      ofType(groupActions.createSuccess),
      map(() => groupActions.load())
    );
  },
  { functional: true }
);

export const notifyCreateSuccess$ = createEffect(
  (
    actions$ = inject(Actions),
    alerts = inject(TuiAlertService)
  ) => {
    return actions$.pipe(
      ofType(groupActions.createSuccess),
      tap(() => {
        alerts
          .open(`Group(s) created`, {
            label: 'Groups creation',
            autoClose: 5000,
          })
          .subscribe();
      })
    );
  },
  { functional: true, dispatch: false }
);

export const notifyCreateFailure$ = createEffect(
  (
    actions$ = inject(Actions),
    alerts = inject(TuiAlertService)
  ) => {
    return actions$.pipe(
      ofType(groupActions.createFailed),
      tap(({ error }) => {
        alerts
          .open(`Error while group creating: ${error.message}`, {
            label: 'Groups creation',
            autoClose: 5000,
          })
          .subscribe();
      })
    );
  },
  { functional: true, dispatch: false }
);

export const deleteGroups$ = createEffect(
  (
    actions$ = inject(Actions),
    api = inject(ApiService),
  ) => {
    return actions$.pipe(
      ofType(groupActions.delete),
      switchMap(({ ids, draftIds }) =>
        api.deleteGroups(ids).pipe(
          map(() => groupActions.deleteSuccess({ids, draftIds})),
          catchError((error: HttpErrorResponse) =>
            of(groupActions.deleteFailed({ error }))
          )
        )
      )
    );
  },
  { functional: true }
);

export const notifyDeleteSuccess$ = createEffect(
  (
    actions$ = inject(Actions),
    alerts = inject(TuiAlertService)
  ) => {
    return actions$.pipe(
      ofType(groupActions.deleteSuccess),
      tap(() => {
        alerts
          .open(`Group(s) deleted`, {
            label: 'Groups deletion',
            autoClose: 5000,
          })
          .subscribe();
      })
    );
  },
  { functional: true, dispatch: false }
);

export const notifyDeleteFailure$ = createEffect(
  (
    actions$ = inject(Actions),
    alerts = inject(TuiAlertService)
  ) => {
    return actions$.pipe(
      ofType(groupActions.deleteFailed),
      tap(({ error }) => {
        alerts
          .open(`Error while groups deleting: ${error.message}`, {
            label: 'Groups deletion',
            autoClose: 5000,
          })
          .subscribe();
      })
    );
  },
  { functional: true, dispatch: false }
);