import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import prisma from '@/config/prisma';
import { authenticate, type AuthenticatedRequest } from '@/middleware/auth';
import { asyncHandler } from '@/utils/async-handler';

export const circularRouter = Router();

function canTarget(role: string, scope: string, targetId?: string) {
  if (role === 'NationalAdmin') return true;
  if (role === 'RegionalAdmin') {
    return scope === 'REGION' || (scope === 'DISTRICT' && Boolean(targetId)) || (scope === 'ASSEMBLY' && Boolean(targetId));
  }
  if (role === 'DistrictAdmin') {
    return scope === 'DISTRICT' || (scope === 'ASSEMBLY' && Boolean(targetId));
  }
  if (role === 'AssemblyAdmin') {
    return scope === 'ASSEMBLY';
  }
  return false;
}

circularRouter.get(
  '/',
  authenticate(),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { scope, targetId } = req.query as { scope?: string; targetId?: string };
    const role = req.user?.role ?? '';

    const circulars = await prisma.circular.findMany({
      where: {
        targetScope: scope,
        targetId,
      },
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ role, circulars });
  }),
);

circularRouter.post(
  '/',
  authenticate(),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const role = req.user?.role ?? '';
    const userId = req.user?.id ?? '';
    const { subject, message, targetScope, targetId } = req.body as {
      subject: string;
      message: string;
      targetScope: string;
      targetId?: string;
    };

    if (!canTarget(role, targetScope, targetId)) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Cannot target this scope' });
    }

    const circular = await prisma.circular.create({
      data: {
        subject,
        message,
        targetScope,
        targetId,
        authorId: userId,
      },
    });

    res.status(StatusCodes.CREATED).json(circular);
  }),
);
