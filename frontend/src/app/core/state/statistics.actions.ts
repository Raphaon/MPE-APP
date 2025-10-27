import { createActionGroup, props } from '@ngrx/store';

export const StatisticsActions = createActionGroup({
  source: 'Statistics',
  events: {
    load: props<{ scope: 'NATIONAL' | 'REGION' | 'DISTRICT' | 'ASSEMBLY'; scopeId?: string }>(),
    loadSuccess: props<{
      totalMembers: number;
      gender: { male: number; female: number };
    }>(),
    loadFailure: props<{ error: string }>(),
  },
});
