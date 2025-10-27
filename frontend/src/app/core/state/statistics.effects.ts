import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { StatisticsApiService } from '../services/statistics.api';
import { StatisticsActions } from './statistics.actions';

@Injectable()
export class StatisticsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(StatisticsApiService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StatisticsActions.load),
      switchMap(({ scope, scopeId }) =>
        this.api.fetch(scope, scopeId).pipe(
          map(response => StatisticsActions.loadSuccess(response)),
          catchError(error =>
            of(
              StatisticsActions.loadFailure({
                error: error.message ?? 'Impossible de récupérer les statistiques',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
