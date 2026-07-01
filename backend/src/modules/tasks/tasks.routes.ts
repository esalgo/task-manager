import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as tasksController from './tasks.controller.js';
import { createTaskSchema, updateTaskSchema } from './tasks.schema.js';

export const tasksRouter: Router = Router();

tasksRouter.use(requireAuth);

tasksRouter.get('/', tasksController.getTasks);
tasksRouter.get('/:id', tasksController.getTask);
tasksRouter.post('/', validate(createTaskSchema), tasksController.createTask);
tasksRouter.put('/:id', validate(updateTaskSchema), tasksController.updateTask);
tasksRouter.delete('/:id', tasksController.deleteTask);
