import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { groupActions } from '../actions/group.actions';
import {
  catchError,
  defaultIfEmpty,
  EMPTY,
  interval,
  map,
  startWith,
  switchMap,
  take,
  takeUntil, tap,
  timer,
} from 'rxjs';
import { ApiService } from '../../islab/api/api.service';
import { routerActions } from '../actions/router.actions';
import { TuiAlertOptions, TuiAlertService } from '@taiga-ui/core';
import {injectContext, PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import { Router } from '@angular/router';
import { TuiPopover } from '@taiga-ui/cdk';

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
  (actions$ = inject(Actions), alerts$ = inject(TuiAlertService)) => {
    return actions$.pipe(
      ofType(groupActions.createDraft),
      //алерт
    )
  },
  {functional: true, dispatch: false}
);

export const onCreate$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(groupActions.create),
      //отправка на бек с созданием и дальше нотификейшн если ок, или не ок
    )
  },
  {functional: true}
);