import { cookies } from 'next/headers';

import { DEMO_USER_EMAIL } from '@/lib/constants';

export const AUTH_COOKIE_NAME = 'rifa_session';
const DEMO_PASSWORD = 'senha123';

export async function getSessionUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (session !== DEMO_USER_EMAIL) {
    return null;
  }

  return {
    email: DEMO_USER_EMAIL,
    name: 'Usuario Demo',
  };
}

export function validateDemoCredentials(email: string, password: string) {
  return email === DEMO_USER_EMAIL && password === DEMO_PASSWORD;
}
