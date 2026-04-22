import { NextRequest, NextResponse } from 'next/server';

import { listAvailableRoletasForCurrentUser, listSpinHistory, spinCurrentUserRoleta } from '@/modules/roleta/service';

export async function GET() {
  try {
    const roletas = await listAvailableRoletasForCurrentUser();

    const total = roletas.reduce((sum, roleta) => sum + roleta.available, 0);

    return NextResponse.json({
      total,
      roletas,
      history: await listSpinHistory(),
    });
  } catch (error) {
    console.error('Erro ao buscar roletas:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await req.json().catch(() => ({}));
    return NextResponse.json(await spinCurrentUserRoleta());
  } catch (error) {
    console.error('Erro ao girar roleta:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro interno' }, { status: 500 });
  }
}
