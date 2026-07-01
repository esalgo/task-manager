import type { Request, Response } from 'express';
import type { CreateTaskInput, UpdateTaskInput } from './tasks.schema.js';
import * as tasksService from './tasks.service.js';

export async function getTasks(req: Request, res: Response) {
  const requester = req.user!;
  const queryUserId = req.query['userId'] as string | undefined;
  const tasks = await tasksService.getTasks(requester.id, requester.rol, queryUserId);
  res.json(tasks);
}

export async function getTask(req: Request, res: Response) {
  const requester = req.user!;
  const task = await tasksService.getTaskById(req.params['id'] as string, requester.id, requester.rol);
  res.json(task);
}

export async function createTask(req: Request, res: Response) {
  const requester = req.user!;
  const task = await tasksService.createTask(req.body as CreateTaskInput, requester.id);
  res.status(201).json(task);
}

export async function updateTask(req: Request, res: Response) {
  const requester = req.user!;
  const task = await tasksService.updateTask(
    req.params['id'] as string,
    requester.id,
    requester.rol,
    req.body as UpdateTaskInput,
  );
  res.json(task);
}

export async function deleteTask(req: Request, res: Response) {
  const requester = req.user!;
  await tasksService.deleteTask(req.params['id'] as string, requester.id, requester.rol);
  res.status(204).send();
}
