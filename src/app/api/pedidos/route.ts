import { NextRequest, NextResponse } from 'next/server';

import { createOrderForCurrentUser, listOrders } from '@/modules/orders/service';

export async function GET() {
  try {
    return NextResponse.json((await listOrders()).slice(0, 30));
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const quantity = Number(body.quantity);
    const campaignId = String(body.campaignId ?? '');

    if (!Number.isInteger(quantity) || quantity <= 0 || !campaignId) {
      return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });
    }

    const { order, roletasEarned } = await createOrderForCurrentUser(campaignId, quantity);

    return NextResponse.json({
      orderId: order.id,
      code: order.code,
      quantity: order.quantity,
      totalAmount: order.totalAmount,
      roletasEarned,
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro interno' }, { status: 500 });
  }
}
