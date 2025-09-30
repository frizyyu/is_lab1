import { provideEventPlugins } from "@taiga-ui/event-plugins";
import { provideAnimations } from "@angular/platform-browser/animations";
import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { rootFeature } from '../state/reducers/root.reducer';
import { FunctionalEffect, provideEffects } from '@ngrx/effects';
import { groupFeature } from '../state/reducers/group.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import * as allEffects from '../state/effects';

function collectFunctionalEffects(ns: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(ns)
  ) as Record<string, FunctionalEffect>;
}

export const appConfig: ApplicationConfig = {
  providers: [
        provideAnimations(),
        provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
        provideEventPlugins(),
    provideHttpClient(),

    provideStore(),
    provideState(rootFeature),
    provideState(groupFeature),
    provideEffects(collectFunctionalEffects(allEffects)),

    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),     // в проде только просмотр
      trace: true,               // показать stacktrace диспатча
      traceLimit: 25,
      // Можно санитайзеры, если состояние большое/не сериализуемое:
      // actionSanitizer: (a) => a,
      // stateSanitizer: (s) => s,
    }),
    ],
};
