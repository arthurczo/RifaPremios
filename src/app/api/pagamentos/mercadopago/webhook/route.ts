import { NextRequest, NextResponse } from 'next/server';

import { canUseMercadoPago, InvalidWebhookSignatureError, validateMercadoPagoWebhookSignature } from '@/lib/mercadopago';
import { reconcileMercadoPagoPayment } from '@/modules/payments/service';

function parseBody(rawBody: string) {
  if (!rawBody.trim()) {
    return {};
  }

  try {
    return JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!canUseMercadoPago()) {
      return NextResponse.json({ ok: true, mode: 'demo' });
    }

    const rawBody = await request.text();
    const body = parseBody(rawBody);
    const searchParams = request.nextUrl.searchParams;
    const dataId = searchParams.get('data.id') ?? searchParams.get('data_id') ?? (body?.data as { id?: string })?.id ?? null;

    validateMercadoPagoWebhookSignature({
      xSignature: request.headers.get('x-signature'),
      xRequestId: request.headers.get('x-request-id'),
      dataId,
    });

    const paymentId = String(
      (body?.data as { id?: string })?.id ??
        searchParams.get('data.id') ??
        searchParams.get('id') ??
        '',
    ).trim();

    if (!paymentId) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const result = await reconcileMercadoPagoPayment({
      paymentId,
      fallbackExternalReference: typeof body?.external_reference === 'string' ? body.external_reference : null,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof InvalidWebhookSignatureError) {
      return NextResponse.json({ error: 'Assinatura invalida' }, { status: 401 });
    }

    console.error('Erro no webhook do Mercado Pago:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno' },
      { status: 500 },
    );
  }
}
