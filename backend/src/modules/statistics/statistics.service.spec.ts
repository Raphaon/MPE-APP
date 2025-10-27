import { describe, expect, it, vi, beforeEach } from 'vitest';

import prisma from '@/config/prisma';
import { getMemberStatistics } from './statistics.service';

describe('statistics service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('computes totals and gender breakdown', async () => {
    const countSpy = vi.spyOn(prisma.member, 'count');
    countSpy.mockResolvedValueOnce(120);
    countSpy.mockResolvedValueOnce(70);
    countSpy.mockResolvedValueOnce(50);

    const stats = await getMemberStatistics({ regionId: 'r1' });
    expect(stats).toEqual({
      totalMembers: 120,
      gender: { male: 70, female: 50 },
    });
    expect(countSpy).toHaveBeenCalledTimes(3);
  });
});
