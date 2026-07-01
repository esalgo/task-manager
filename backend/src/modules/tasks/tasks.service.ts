import { AppError } from '../../errors/app-error.js';
import { prisma } from '../../lib/prisma.js';
import type { CreateTaskInput, UpdateTaskInput } from './tasks.schema.js';

export async function getTasks(requesterId: string, requesterRol: string, queryUserId?: string) {
  if (requesterRol === 'Administrador') {
    return prisma.task.findMany({
      ...(queryUserId ? { where: { userId: queryUserId } } : {}),
      orderBy: { createdAt: 'desc' },
    });
  }
  return prisma.task.findMany({
    where: { userId: requesterId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getTaskById(taskId: string, requesterId: string, requesterRol: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new AppError(404, 'Tarea no encontrada');
  if (requesterRol !== 'Administrador' && task.userId !== requesterId) {
    throw new AppError(403, 'No autorizado');
  }
  return task;
}

export async function createTask(data: CreateTaskInput, userId: string) {
  return prisma.task.create({
    data: {
      title: data.title,
      category: data.category,
      date: data.date,
      priority: data.priority,
      status: data.status,
      description: data.description,
      userId,
    },
  });
}

export async function updateTask(
  taskId: string,
  requesterId: string,
  requesterRol: string,
  data: UpdateTaskInput,
) {
  await getTaskById(taskId, requesterId, requesterRol);
  const { title, category, date, priority, status, description } = data;
  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...(title !== undefined && { title }),
      ...(category !== undefined && { category }),
      ...(date !== undefined && { date }),
      ...(priority !== undefined && { priority }),
      ...(status !== undefined && { status }),
      ...(description !== undefined && { description }),
    },
  });
}

export async function deleteTask(taskId: string, requesterId: string, requesterRol: string) {
  await getTaskById(taskId, requesterId, requesterRol);
  await prisma.task.delete({ where: { id: taskId } });
}
