import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { AUTH_COOKIE_NAME, registerUser } from '@/lib/auth';

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Nome obrigatorio'),
  email: z.string().trim().email('Email invalido'),
  password: z.string().min(8, 'A senha precisa ter pelo menos 8 caracteres'),
});

export async function POST(request: NextRequest) {
  try {
    const payload = registerSchema.parse(await request.json());
    const user = await registerUser(payload);
    const response = NextResponse.json(
      {
        ok: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 },
    );

    response.cookies.set(AUTH_COOKIE_NAME, user.id, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    const message = error instanceof z.ZodError
      ? error.issues[0]?.message ?? 'Dados invalidos'
      : error instanceof Error
        ? error.message
        : 'Erro interno';

    const status = error instanceof z.ZodError || message === 'Email ja cadastrado' ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
