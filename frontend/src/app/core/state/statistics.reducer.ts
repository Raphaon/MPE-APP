import { createReducer, on } from '@ngrx/store';

import { StatisticsActions } from './statistics.actions';
import { initialStatisticsState } from './statistics.models';

export const statisticsReducer = createReducer(
  initialStatisticsState,
  on(StatisticsActions.load, state => ({ ...state, loading: true })),
  on(StatisticsActions.loadSuccess, (state, payload) => ({
    ...state,
    ...payload,
    loading: false,
    lastUpdated: new Date().toISOString(),
  })),
  on(StatisticsActions.loadFailure, state => ({
    ...state,
    loading: false,
  })),
);
