import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app-error.js';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    const body: Record<string, unknown> = { message: err.message };
    if (err.details !== undefined) body['details'] = err.details;
    res.status(err.statusCode).json(body);
    return;
  }

  // Prisma known request errors (P2002 = unique constraint, P2025 = not found)
  if (typeof err === 'object' && err !== null && 'code' in err) {
    const code = (err as { code: unknown }).code;
    if (code === 'P2002') {
      res.status(409).json({ message: 'El email ya está registrado' });
      return;
    }
    if (code === 'P2025') {
      res.status(404).json({ message: 'Recurso no encontrado' });
      return;
    }
  }

  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
}
