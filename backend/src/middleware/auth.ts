import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '@/config/env';
import prisma from '@/config/prisma';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function authenticate(requiredRoles: string[] = []) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing authentication token' });
    }

    try {
      const token = authHeader.substring(7);
      const payload = jwt.verify(token, env.jwtSecret) as { sub: string };
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        include: { role: true },
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role.name)) {
        return res.status(403).json({ message: 'Insufficient privileges' });
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role.name,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}
