import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import prisma from '@/config/prisma';
import { env } from '@/config/env';
import { asyncHandler } from '@/utils/async-handler';

export const authRouter = Router();

authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body as { email: string; password: string };
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true, member: true },
    });

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ sub: user.id, role: user.role.name }, env.jwtSecret, {
      expiresIn: '12h',
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role.name,
        memberId: user.memberId,
      },
    });
  }),
);

authRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { email, password, roleName, memberId } = req.body as {
      email: string;
      password: string;
      roleName: string;
      memberId?: string;
    };

    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Unknown role' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashed,
        roleId: role.id,
        memberId,
      },
    });

    res.status(StatusCodes.CREATED).json({
      id: user.id,
      email: user.email,
    });
  }),
);
