import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import prisma from '@/config/prisma';
import { authenticate } from '@/middleware/auth';
import { asyncHandler } from '@/utils/async-handler';

export const ministryRouter = Router();

ministryRouter.get(
  '/',
  authenticate(),
  asyncHandler(async (req, res) => {
    const { assemblyId } = req.query;
    const ministries = await prisma.ministry.findMany({
      where: assemblyId ? { assemblyId: String(assemblyId) } : undefined,
      include: {
        assembly: true,
        members: { include: { member: true } },
      },
    });
    res.json(ministries);
  }),
);

ministryRouter.post(
  '/',
  authenticate(['NationalAdmin', 'RegionalAdmin', 'DistrictAdmin', 'AssemblyAdmin']),
  asyncHandler(async (req, res) => {
    const ministry = await prisma.ministry.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        assemblyId: req.body.assemblyId,
      },
    });
    res.status(StatusCodes.CREATED).json(ministry);
  }),
);

ministryRouter.post(
  '/:id/members',
  authenticate(['NationalAdmin', 'RegionalAdmin', 'DistrictAdmin', 'AssemblyAdmin']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { memberId, role } = req.body as { memberId: string; role?: string };
    const ministryMember = await prisma.memberMinistry.create({
      data: {
        ministryId: id,
        memberId,
        role,
      },
    });
    res.status(StatusCodes.CREATED).json(ministryMember);
  }),
);

ministryRouter.delete(
  '/:id/members/:memberId',
  authenticate(['NationalAdmin', 'RegionalAdmin', 'DistrictAdmin', 'AssemblyAdmin']),
  asyncHandler(async (req, res) => {
    const { id, memberId } = req.params;
    await prisma.memberMinistry.delete({ where: { memberId_ministryId: { ministryId: id, memberId } } });
    res.status(StatusCodes.NO_CONTENT).send();
  }),
);
