import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app-error.js';
import { verifyAccessToken } from '../modules/auth/token.utils.js';

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      next(new AppError(401, 'Token requerido'));
      return;
    }
    req.user = verifyAccessToken(authHeader.slice(7));
    next();
  } catch {
    next(new AppError(401, 'Token inválido o expirado'));
  }
}
