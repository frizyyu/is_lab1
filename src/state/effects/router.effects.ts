import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { rootActions } from '../actions/root.actions';
import {
  catchError,
  defaultIfEmpty,
  EMPTY,
  filter,
  interval,
  map,
  mergeMap,
  of,
  startWith,
  switchMap,
  take,
  takeUntil,
  timer,
} from 'rxjs';
import { ApiService } from '../../islab/api/api.service';
import { groupActions } from '../actions/group.actions';
import { routerActions } from '../actions/router.actions';
import { Router } from '@angular/router';

export const onNavigateToGroupListPage$ = createEffect(
  (
    actions$ = inject(Actions),
    router$ = inject(Router),
  ) => {
    return actions$.pipe(
      ofType(routerActions.navigateToGroupListPage),
      map(() => router$.navigate(['/groups'], { skipLocationChange: true })),
    );
  },
  {functional: true, dispatch: false}
);

