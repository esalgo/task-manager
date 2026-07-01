import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { AppError } from '../errors/app-error.js';

export function validate(schema: z.ZodTypeAny, part: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      next(new AppError(400, 'Datos inválidos', result.error.issues));
      return;
    }
    if (part === 'body') req.body = result.data as Record<string, unknown>;
    next();
  };
}
