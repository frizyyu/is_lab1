import { createActionGroup, emptyProps } from '@ngrx/store';

export const routerFeatureKey = 'router';

export const routerActions = createActionGroup({
  source: routerFeatureKey,
  events: {
    navigateToGroupListPage: emptyProps(),
    navigateToErrorPage: emptyProps(),
    navigateToStatsPage: emptyProps(),
    navigateBack: emptyProps(),
  },
});
