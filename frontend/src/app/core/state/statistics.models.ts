export interface StatisticsState {
  totalMembers: number;
  gender: {
    male: number;
    female: number;
  };
  lastUpdated: string | null;
  loading: boolean;
}

export const initialStatisticsState: StatisticsState = {
  totalMembers: 0,
  gender: { male: 0, female: 0 },
  lastUpdated: null,
  loading: false,
};
