import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import * as statisticsController from './statistics.controller.js';

export const statisticsRouter: Router = Router();

statisticsRouter.use(requireAuth, requireRole('Administrador'));
statisticsRouter.get('/', statisticsController.getStatistics);
