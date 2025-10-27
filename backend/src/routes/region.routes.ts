import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import prisma from '@/config/prisma';
import { authenticate } from '@/middleware/auth';
import { asyncHandler } from '@/utils/async-handler';

export const regionRouter = Router();

regionRouter.get(
  '/',
  authenticate(),
  asyncHandler(async (_req, res) => {
    const regions = await prisma.region.findMany({
      include: {
        districts: {
          include: {
            assemblies: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
    res.json(regions);
  }),
);

regionRouter.post(
  '/',
  authenticate(['NationalAdmin']),
  asyncHandler(async (req, res) => {
    const region = await prisma.region.create({
      data: req.body,
    });
    res.status(StatusCodes.CREATED).json(region);
  }),
);

regionRouter.put(
  '/:id',
  authenticate(['NationalAdmin']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const region = await prisma.region.update({
      where: { id },
      data: req.body,
    });
    res.json(region);
  }),
);

regionRouter.delete(
  '/:id',
  authenticate(['NationalAdmin']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.region.delete({ where: { id } });
    res.status(StatusCodes.NO_CONTENT).send();
  }),
);
