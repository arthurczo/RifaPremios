import { NextRequest, NextResponse } from 'next/server';

import { getAvailableRoletas, getSpinHistory, spinDemoRoleta } from '@/lib/demo-data';

export async function GET() {
  try {
    const roletas = getAvailableRoletas();

    const total = roletas.reduce((sum, roleta) => sum + roleta.available, 0);

    return NextResponse.json({
      total,
      roletas,
      history: getSpinHistory().slice(0, 10),
    });
  } catch (error) {
    console.error('Erro ao buscar roletas:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await req.json().catch(() => ({}));
    return NextResponse.json(spinDemoRoleta());
  } catch (error) {
    console.error('Erro ao girar roleta:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro interno' }, { status: 500 });
  }
}
