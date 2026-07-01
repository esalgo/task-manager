import bcrypt from 'bcrypt';
import { AppError } from '../../errors/app-error.js';
import { prisma } from '../../lib/prisma.js';
import type { LoginInput, RegisterInput } from './auth.schema.js';
import { generateAccessToken, generateRefreshToken } from './token.utils.js';

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function registerUser(data: RegisterInput) {
  const passwordHash = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: { name: data.name, email: data.email, password: passwordHash },
    select: { id: true, name: true, email: true, rol: true },
  });
}

export async function loginUser(data: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw new AppError(401, 'Credenciales inválidas');

  const valid = await bcrypt.compare(data.password, user.password);
  if (!valid) throw new AppError(401, 'Credenciales inválidas');

  const rawRefreshToken = generateRefreshToken();
  await prisma.refreshToken.create({
    data: {
      token: rawRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });

  return {
    accessToken: generateAccessToken({ id: user.id, rol: user.rol }),
    refreshToken: rawRefreshToken,
    user: { id: user.id, name: user.name, email: user.email, rol: user.rol },
  };
}

export async function refreshTokens(rawToken: string) {
  const record = await prisma.refreshToken.findUnique({
    where: { token: rawToken },
    include: { user: { select: { rol: true } } },
  });

  if (!record || record.revokedAt !== null || record.expiresAt < new Date()) {
    throw new AppError(401, 'Refresh token inválido o expirado');
  }

  await prisma.refreshToken.update({
    where: { id: record.id },
    data: { revokedAt: new Date() },
  });

  const newRawToken = generateRefreshToken();
  await prisma.refreshToken.create({
    data: {
      token: newRawToken,
      userId: record.userId,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });

  return {
    accessToken: generateAccessToken({ id: record.userId, rol: record.user.rol }),
    refreshToken: newRawToken,
  };
}

export async function logoutUser(rawToken: string) {
  await prisma.refreshToken.updateMany({
    where: { token: rawToken },
    data: { revokedAt: new Date() },
  });
}
