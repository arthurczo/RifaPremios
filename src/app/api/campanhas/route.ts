import { NextResponse } from 'next/server';

import { getCampaigns } from '@/lib/demo-data';

export async function GET() {
  try {
    return NextResponse.json(getCampaigns());
  } catch (error) {
    console.error('Erro ao buscar campanhas:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
