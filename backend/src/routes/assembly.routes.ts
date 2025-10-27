import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import prisma from '@/config/prisma';
import { authenticate } from '@/middleware/auth';
import { asyncHandler } from '@/utils/async-handler';

export const assemblyRouter = Router();

assemblyRouter.get(
  '/',
  authenticate(),
  asyncHandler(async (req, res) => {
    const { districtId } = req.query;
    const assemblies = await prisma.assembly.findMany({
      where: districtId ? { districtId: String(districtId) } : undefined,
      include: { district: true, members: true, ministries: true },
      orderBy: { name: 'asc' },
    });
    res.json(assemblies);
  }),
);

assemblyRouter.post(
  '/',
  authenticate(['NationalAdmin', 'RegionalAdmin', 'DistrictAdmin']),
  asyncHandler(async (req, res) => {
    const assembly = await prisma.assembly.create({ data: req.body });
    res.status(StatusCodes.CREATED).json(assembly);
  }),
);

assemblyRouter.put(
  '/:id',
  authenticate(['NationalAdmin', 'RegionalAdmin', 'DistrictAdmin']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const assembly = await prisma.assembly.update({
      where: { id },
      data: req.body,
    });
    res.json(assembly);
  }),
);

assemblyRouter.delete(
  '/:id',
  authenticate(['NationalAdmin', 'RegionalAdmin', 'DistrictAdmin']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.assembly.delete({ where: { id } });
    res.status(StatusCodes.NO_CONTENT).send();
  }),
);
