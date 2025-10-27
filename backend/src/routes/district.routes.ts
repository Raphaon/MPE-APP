import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import prisma from '@/config/prisma';
import { authenticate } from '@/middleware/auth';
import { asyncHandler } from '@/utils/async-handler';

export const districtRouter = Router();

districtRouter.get(
  '/',
  authenticate(),
  asyncHandler(async (req, res) => {
    const { regionId } = req.query;
    const districts = await prisma.district.findMany({
      where: regionId ? { regionId: String(regionId) } : undefined,
      include: { assemblies: true, region: true },
      orderBy: { name: 'asc' },
    });
    res.json(districts);
  }),
);

districtRouter.post(
  '/',
  authenticate(['NationalAdmin', 'RegionalAdmin']),
  asyncHandler(async (req, res) => {
    const district = await prisma.district.create({ data: req.body });
    res.status(StatusCodes.CREATED).json(district);
  }),
);

districtRouter.put(
  '/:id',
  authenticate(['NationalAdmin', 'RegionalAdmin']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const district = await prisma.district.update({
      where: { id },
      data: req.body,
    });
    res.json(district);
  }),
);

districtRouter.delete(
  '/:id',
  authenticate(['NationalAdmin', 'RegionalAdmin']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.district.delete({ where: { id } });
    res.status(StatusCodes.NO_CONTENT).send();
  }),
);
