import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { createMercadoPagoCheckoutForCurrentUser } from '@/modules/payments/service';

const checkoutSchema = z.object({
  campaignId: z.string().min(1, 'Campanha obrigatoria'),
  quantity: z.coerce.number().int().positive('Quantidade invalida'),
});

export async function POST(request: NextRequest) {
  try {
    const payload = checkoutSchema.parse(await request.json());
    const checkout = await createMercadoPagoCheckoutForCurrentUser({
      ...payload,
      appUrl: request.nextUrl.origin,
    });

    return NextResponse.json(checkout);
  } catch (error) {
    const message = error instanceof z.ZodError
      ? error.issues[0]?.message ?? 'Dados invalidos'
      : error instanceof Error
        ? error.message
        : 'Erro interno';

    const status = error instanceof z.ZodError ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
