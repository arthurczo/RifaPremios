import { cookies } from 'next/headers';

import { DEMO_USER_EMAIL } from '@/lib/constants';
import { AUTH_COOKIE_NAME } from '@/modules/auth/constants';
import { authRepository } from '@/modules/auth/repository';

const DEMO_PASSWORD = 'senha123';

export async function getSessionUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const user = await authRepository.getDemoUser();

  if (!user || session !== user.email) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

export function validateDemoCredentials(email: string, password: string) {
  return email === DEMO_USER_EMAIL && password === DEMO_PASSWORD;
}

export async function getDemoAuthUser() {
  const user = await authRepository.getDemoUser();

  if (!user) {
    throw new Error('Usuario demo nao encontrado no banco');
  }

  return user;
}
