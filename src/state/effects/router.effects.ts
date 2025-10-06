import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs';
import { routerActions } from '../actions/router.actions';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

export const onNavigateToGroupListPage$ = createEffect(
  (actions$ = inject(Actions), router$ = inject(Router)) => {
    return actions$.pipe(
      ofType(routerActions.navigateToGroupListPage),
      map(() => router$.navigate(['/groups'])),
    );
  },
  { functional: true, dispatch: false },
);

export const onNavigateBack$ = createEffect(
  (actions$ = inject(Actions), location = inject(Location)) => {
    return actions$.pipe(
      ofType(routerActions.navigateBack),
      tap(() => location.back()),
    );
  },
  { functional: true, dispatch: false },
);

export const onNavigateToStatsPage$ = createEffect(
  (actions$ = inject(Actions), router$ = inject(Router)) => {
    return actions$.pipe(
      ofType(routerActions.navigateToStatsPage),
      map(() => router$.navigate(['/stats'])),
    );
  },
  { functional: true, dispatch: false },
);

export const onNavigateToErrosPage$ = createEffect(
  (actions$ = inject(Actions), router$ = inject(Router)) => {
    return actions$.pipe(
      ofType(routerActions.navigateToErrorPage),
      map(() => router$.navigate(['/error'])),
    );
  },
  { functional: true, dispatch: false },
);
