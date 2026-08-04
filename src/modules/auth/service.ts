import { cookies } from 'next/headers';

import { DEMO_USER_EMAIL } from '@/lib/constants';
import { hashPassword, verifyPassword } from '@/lib/password';
import { AUTH_COOKIE_NAME } from '@/modules/auth/constants';
import { authRepository } from '@/modules/auth/repository';

const DEMO_PASSWORD = 'senha123';

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
};

export async function getSessionUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get(AUTH_COOKIE_NAME)?.value?.trim();

  if (!session) {
    return null;
  }

  const user = (await authRepository.findById(session)) ?? (await authRepository.findByEmail(session));

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin,
  };
}

export async function requireSessionUser() {
  const user = await getSessionUser();

  if (!user) {
    throw new Error('Login necessario para continuar');
  }

  return user;
}

export function validateDemoCredentials(email: string, password: string) {
  return email.trim().toLowerCase() === DEMO_USER_EMAIL && password === DEMO_PASSWORD;
}

export async function authenticateUser(email: string, password: string) {
  const user = await authRepository.findByEmail(email);

  if (!user) {
    throw new Error('Credenciais invalidas');
  }

  if (!verifyPassword(password, user.passwordHash)) {
    throw new Error('Credenciais invalidas');
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin,
  };
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const normalizedEmail = input.email.trim().toLowerCase();
  const existingUser = await authRepository.findByEmail(normalizedEmail);

  if (existingUser) {
    throw new Error('Email ja cadastrado');
  }

  const user = await authRepository.create({
    name: input.name,
    email: normalizedEmail,
    passwordHash: hashPassword(input.password),
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin,
  };
}

export async function getDemoAuthUser() {
  return requireSessionUser();
}
