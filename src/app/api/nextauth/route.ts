import { NextResponse } from 'next/server';

const message = 'NextAuth ainda nao foi configurado neste MVP.';

export async function GET() {
  return NextResponse.json({ error: message }, { status: 501 });
}

export async function POST() {
  return NextResponse.json({ error: message }, { status: 501 });
}
