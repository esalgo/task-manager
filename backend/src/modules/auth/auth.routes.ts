import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import { loginSchema, registerSchema } from './auth.schema.js';
import * as authController from './auth.controller.js';

export const authRouter: Router = Router();

authRouter.post('/register', validate(registerSchema), authController.register);
authRouter.post('/login', validate(loginSchema), authController.login);
authRouter.post('/refresh', authController.refresh);
authRouter.post('/logout', authController.logout);
