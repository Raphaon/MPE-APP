import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import prisma from '@/config/prisma';
import { authenticate } from '@/middleware/auth';
import { asyncHandler } from '@/utils/async-handler';

export const memberRouter = Router();

memberRouter.get(
  '/',
  authenticate(),
  asyncHandler(async (req, res) => {
    const { assemblyId, districtId, regionId } = req.query as {
      assemblyId?: string;
      districtId?: string;
      regionId?: string;
    };

    const members = await prisma.member.findMany({
      where: {
        ...(assemblyId ? { assemblyId: String(assemblyId) } : {}),
        ...(districtId ? { assembly: { districtId: String(districtId) } } : {}),
        ...(regionId ? { assembly: { district: { regionId: String(regionId) } } } : {}),
      },
      include: {
        assembly: { include: { district: { include: { region: true } } } },
        ministries: { include: { ministry: true } },
      },
      orderBy: { fullName: 'asc' },
    });
    res.json(members);
  }),
);

memberRouter.post(
  '/',
  authenticate(['NationalAdmin', 'RegionalAdmin', 'DistrictAdmin', 'AssemblyAdmin']),
  asyncHandler(async (req, res) => {
    const member = await prisma.member.create({ data: req.body });
    res.status(StatusCodes.CREATED).json(member);
  }),
);

memberRouter.put(
  '/:id',
  authenticate(['NationalAdmin', 'RegionalAdmin', 'DistrictAdmin', 'AssemblyAdmin']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const member = await prisma.member.update({
      where: { id },
      data: req.body,
    });
    res.json(member);
  }),
);

memberRouter.post(
  '/:id/transfer',
  authenticate(['NationalAdmin', 'RegionalAdmin', 'DistrictAdmin', 'AssemblyAdmin']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { targetAssemblyId } = req.body as { targetAssemblyId: string };
    const member = await prisma.member.update({
      where: { id },
      data: {
        assemblyId: targetAssemblyId,
        status: 'TRANSFERRED',
      },
    });
    res.json(member);
  }),
);

memberRouter.delete(
  '/:id',
  authenticate(['NationalAdmin', 'RegionalAdmin', 'DistrictAdmin', 'AssemblyAdmin']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.member.delete({ where: { id } });
    res.status(StatusCodes.NO_CONTENT).send();
  }),
);
