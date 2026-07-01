import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as usersController from './users.controller.js';
import { createUserSchema, updateUserSchema } from './users.schema.js';

export const usersRouter: Router = Router();

usersRouter.use(requireAuth);

usersRouter.get('/', requireRole('Administrador'), usersController.getUsers);
usersRouter.get('/:id', usersController.getUser);
usersRouter.post('/', requireRole('Administrador'), validate(createUserSchema), usersController.createUser);
usersRouter.put('/:id', validate(updateUserSchema), usersController.updateUser);
usersRouter.delete('/:id', requireRole('Administrador'), usersController.deleteUser);
