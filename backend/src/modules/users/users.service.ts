import bcrypt from 'bcrypt';
import { AppError } from '../../errors/app-error.js';
import { prisma } from '../../lib/prisma.js';
import type { CreateUserInput, UpdateUserInput } from './users.schema.js';

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  rol: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function getAllUsers() {
  return prisma.user.findMany({ select: USER_SELECT, orderBy: { createdAt: 'desc' } });
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id }, select: USER_SELECT });
  if (!user) throw new AppError(404, 'Usuario no encontrado');
  return user;
}

export async function createUser(data: CreateUserInput) {
  const passwordHash = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: { name: data.name, email: data.email, password: passwordHash, rol: data.rol },
    select: USER_SELECT,
  });
}

export async function updateUser(
  requesterId: string,
  requesterRol: string,
  targetId: string,
  data: UpdateUserInput,
) {
  const isAdmin = requesterRol === 'Administrador';
  const isSelf = requesterId === targetId;

  if (!isSelf && !isAdmin) throw new AppError(403, 'No autorizado');

  if (!isAdmin && (data.email !== undefined || data.rol !== undefined)) {
    throw new AppError(403, 'No puedes modificar el email o el rol');
  }

  await getUserById(targetId);

  const passwordHash = data.password ? await bcrypt.hash(data.password, 10) : undefined;

  const updateData = {
    ...(data.name !== undefined ? { name: data.name } : {}),
    ...(passwordHash !== undefined ? { password: passwordHash } : {}),
    ...(isAdmin && data.email !== undefined ? { email: data.email } : {}),
    ...(isAdmin && data.rol !== undefined ? { rol: data.rol as 'Usuario' | 'Administrador' } : {}),
  };

  return prisma.user.update({ where: { id: targetId }, data: updateData, select: USER_SELECT });
}

export async function deleteUser(id: string) {
  await getUserById(id);
  await prisma.user.delete({ where: { id } });
}
