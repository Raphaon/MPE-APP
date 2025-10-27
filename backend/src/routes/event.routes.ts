import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import prisma from '@/config/prisma';
import { authenticate } from '@/middleware/auth';
import { asyncHandler } from '@/utils/async-handler';

export const eventRouter = Router();

eventRouter.get(
  '/',
  authenticate(),
  asyncHandler(async (req, res) => {
    const { scope, scopeId } = req.query as { scope?: string; scopeId?: string };
    const filters =
      scope === 'REGION'
        ? { regionId: scopeId }
        : scope === 'DISTRICT'
          ? { districtId: scopeId }
          : scope === 'ASSEMBLY'
            ? { assemblyId: scopeId }
            : undefined;
    const events = await prisma.event.findMany({
      where: filters ?? undefined,
      orderBy: { startDate: 'asc' },
    });
    res.json(events);
  }),
);

eventRouter.post(
  '/',
  authenticate(['NationalAdmin', 'RegionalAdmin', 'DistrictAdmin', 'AssemblyAdmin']),
  asyncHandler(async (req, res) => {
    const event = await prisma.event.create({ data: req.body });
    res.status(StatusCodes.CREATED).json(event);
  }),
);

eventRouter.put(
  '/:id',
  authenticate(['NationalAdmin', 'RegionalAdmin', 'DistrictAdmin', 'AssemblyAdmin']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const event = await prisma.event.update({
      where: { id },
      data: req.body,
    });
    res.json(event);
  }),
);

eventRouter.delete(
  '/:id',
  authenticate(['NationalAdmin', 'RegionalAdmin', 'DistrictAdmin', 'AssemblyAdmin']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.event.delete({ where: { id } });
    res.status(StatusCodes.NO_CONTENT).send();
  }),
);
