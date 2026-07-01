import type { Request, Response } from 'express';
import { AppError } from '../../errors/app-error.js';
import type { CreateUserInput, UpdateUserInput } from './users.schema.js';
import * as usersService from './users.service.js';

export async function getUsers(_req: Request, res: Response) {
  const users = await usersService.getAllUsers();
  res.json(users);
}

export async function getUser(req: Request, res: Response) {
  const id = req.params['id'] as string;
  const requester = req.user!;

  if (requester.rol !== 'Administrador' && requester.id !== id) {
    throw new AppError(403, 'No autorizado');
  }

  const user = await usersService.getUserById(id);
  res.json(user);
}

export async function createUser(req: Request, res: Response) {
  const user = await usersService.createUser(req.body as CreateUserInput);
  res.status(201).json(user);
}

export async function updateUser(req: Request, res: Response) {
  const id = req.params['id'] as string;
  const requester = req.user!;
  const user = await usersService.updateUser(requester.id, requester.rol, id, req.body as UpdateUserInput);
  res.json(user);
}

export async function deleteUser(req: Request, res: Response) {
  const id = req.params['id'] as string;
  await usersService.deleteUser(id);
  res.status(204).send();
}
