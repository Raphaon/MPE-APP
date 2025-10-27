import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { statisticsReducer } from './core/state/statistics.reducer';
import { StatisticsEffects } from './core/state/statistics.effects';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptorsFromDi()),
    provideStore({ statistics: statisticsReducer }),
    provideEffects([StatisticsEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: environment.production }),
  ],
};
