import { NextRequest, NextResponse } from 'next/server';

import { AUTH_COOKIE_NAME, validateDemoCredentials } from '@/lib/auth';
import { getDemoAuthUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email ?? '').trim();
    const password = String(body.password ?? '');

    if (!validateDemoCredentials(email, password)) {
      return NextResponse.json({ error: 'Credenciais invalidas' }, { status: 401 });
    }

    const user = await getDemoAuthUser();
    const response = NextResponse.json({
      ok: true,
      user: {
        email: user.email,
        name: user.name,
      },
    });

    response.cookies.set(AUTH_COOKIE_NAME, user.email, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
