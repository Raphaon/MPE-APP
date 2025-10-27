import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

interface ApiError extends Error {
  statusCode?: number;
  details?: unknown;
}

export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message ?? 'Unexpected error';
  res.status(statusCode).json({
    statusCode,
    message,
    details: err.details ?? null,
  });
}
