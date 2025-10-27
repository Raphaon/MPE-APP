import { createFeatureSelector } from '@ngrx/store';

import { StatisticsState } from './statistics.models';

export const selectStatisticsState = createFeatureSelector<StatisticsState>('statistics');
