import type { Request, Response } from 'express';
import * as statisticsService from './statistics.service.js';

export async function getStatistics(_req: Request, res: Response) {
  const stats = await statisticsService.getStatistics();
  res.json(stats);
}
