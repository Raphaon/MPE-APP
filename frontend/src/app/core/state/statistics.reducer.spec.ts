import { StatisticsActions } from './statistics.actions';
import { statisticsReducer } from './statistics.reducer';
import { initialStatisticsState } from './statistics.models';

describe('statisticsReducer', () => {
  it('should set loading on load', () => {
    const state = statisticsReducer(initialStatisticsState, StatisticsActions.load({ scope: 'NATIONAL' }));
    expect(state.loading).toBe(true);
  });

  it('should set payload on success', () => {
    const state = statisticsReducer(
      initialStatisticsState,
      StatisticsActions.loadSuccess({ totalMembers: 100, gender: { male: 60, female: 40 } }),
    );
    expect(state.totalMembers).toBe(100);
    expect(state.gender.male).toBe(60);
    expect(state.loading).toBe(false);
  });
});
