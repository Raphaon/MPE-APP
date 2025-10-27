import { Router } from 'express';

import prisma from '@/config/prisma';
import { authenticate } from '@/middleware/auth';
import { asyncHandler } from '@/utils/async-handler';

export const statsRouter = Router();

statsRouter.get(
  '/',
  authenticate(),
  asyncHandler(async (req, res) => {
    const { regionId, districtId, assemblyId } = req.query as {
      regionId?: string;
      districtId?: string;
      assemblyId?: string;
    };

    const whereClause = assemblyId
      ? { assemblyId }
      : districtId
        ? { assembly: { districtId } }
        : regionId
          ? { assembly: { district: { regionId } } }
          : {};

    const [members, maleCount, femaleCount, childrenCount, adultCount] = await Promise.all([
      prisma.member.count({ where: whereClause }),
      prisma.member.count({ where: { ...whereClause, gender: 'MALE' } }),
      prisma.member.count({ where: { ...whereClause, gender: 'FEMALE' } }),
      prisma.member.count({
        where: {
          ...whereClause,
          birthDate: {
            gte: new Date(new Date().setFullYear(new Date().getFullYear() - 13)),
          },
        },
      }),
      prisma.member.count({
        where: {
          ...whereClause,
          birthDate: {
            lt: new Date(new Date().setFullYear(new Date().getFullYear() - 13)),
          },
        },
      }),
    ]);

    res.json({
      totalMembers: members,
      gender: {
        male: maleCount,
        female: femaleCount,
      },
      ageGroups: {
        children: childrenCount,
        adults: adultCount,
      },
    });
  }),
);
