import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { rootActions } from '../actions/root.actions';
import {
  map, tap,
} from 'rxjs';
import { routerActions } from '../actions/router.actions';
import { groupActions } from '../actions/group.actions';

/*
export const onApplicationStart$ = createEffect(
  (
    actions$ = inject(Actions),
  ) => {
    return actions$.pipe(
      ofType(rootActions.toGroupPageButtonClicked),
      map(() => groupActions.load()),
    );
  },
  {functional: true}
);*/


