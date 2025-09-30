import { createActionGroup, emptyProps } from '@ngrx/store'

export const rootFeatureKey = 'root';

export const rootActions = createActionGroup({
  source: rootFeatureKey,
  events: {
    applicationStart: emptyProps(),
    startLoad: emptyProps(),
  },
});
