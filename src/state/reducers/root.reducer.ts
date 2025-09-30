import { createFeature, createReducer, on } from '@ngrx/store';
import { rootActions, rootFeatureKey } from '../actions/root.actions';
import { RootState } from '../interface/root-state.interface';
import { groupActions } from '../actions/group.actions';
import { routerActions } from '../actions/router.actions';

export const initialRootState: RootState = {
  showLoader: true,
}

export const rootFeature = createFeature({
  name: rootFeatureKey,
  reducer: createReducer(
    initialRootState,
    on(
      rootActions.applicationStart,
      routerActions.navigateToGroupListPage,
      routerActions.navigateToErrorPage,
      (state): RootState => ({
        ...state,
        showLoader: false,
      })
    ),
    on(
      groupActions.load,
      (state): RootState => ({
        ...state,
        showLoader: true,
      })
    ),
  ),
});