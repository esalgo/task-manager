import type { Request, Response } from 'express';
import type { LoginInput, RegisterInput } from './auth.schema.js';
import * as authService from './auth.service.js';

const REFRESH_COOKIE = 'refreshToken';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function register(req: Request, res: Response) {
  const user = await authService.registerUser(req.body as RegisterInput);
  res.status(201).json(user);
}

export async function login(req: Request, res: Response) {
  const { accessToken, refreshToken, user } = await authService.loginUser(
    req.body as LoginInput,
  );
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);
  res.json({ accessToken, user });
}

export async function refresh(req: Request, res: Response) {
  const rawToken = req.cookies[REFRESH_COOKIE] as string | undefined;
  if (!rawToken) {
    res.status(401).json({ message: 'Refresh token no encontrado' });
    return;
  }
  const { accessToken, refreshToken } = await authService.refreshTokens(rawToken);
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);
  res.json({ accessToken });
}

export async function logout(req: Request, res: Response) {
  const rawToken = req.cookies[REFRESH_COOKIE] as string | undefined;
  if (rawToken) await authService.logoutUser(rawToken);
  res.clearCookie(REFRESH_COOKIE);
  res.json({ message: 'Sesión cerrada' });
}
