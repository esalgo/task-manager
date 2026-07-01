import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app-error.js';

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.rol)) {
      next(new AppError(403, 'No tienes permisos para esta acción'));
      return;
    }
    next();
  };
}
