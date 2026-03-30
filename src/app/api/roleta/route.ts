import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json();

        // Verificar roletas disponíveis
        const roleta = await prisma.customerRoleta.findFirst({
            where: {
                userId,
                available: { gt: 0 },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!roleta) {
            return NextResponse.json(
                { error: 'Sem roletas disponíveis' },
                { status: 400 }
            );
        }

        // Buscar prêmios ativos
        const prizes = await prisma.prize.findMany({
            where: { active: true },
        });

        // Sortear baseado em probabilidade
        const winner = weightedRandom(prizes);

        // Atualizar banco
        await prisma.$transaction([
            // Decrementar roletas
            prisma.customerRoleta.update({
                where: { id: roleta.id },
                data: {
                    used: { increment: 1 },
                    available: { decrement: 1 },
                },
            }),
            // Registrar giro
            prisma.roletaSpin.create({
                data: {
                    customerRoletaId: roleta.id,
                    prizeId: winner.id,
                },
            }),
        ]);

        return NextResponse.json({
            prize: winner,
            remaining: roleta.available - 1,
        });
    } catch (error) {
        console.error('Erro ao girar roleta:', error);
        return NextResponse.json(
            { error: 'Erro interno' },
            { status: 500 }
        );
    }
}

// Função auxiliar para sorteio ponderado
function weightedRandom(prizes: any[]) {
    const pool: any[] = [];

    prizes.forEach((prize) => {
        const weight = Number(prize.probability);
        for (let i = 0; i < weight; i++) {
            pool.push(prize);
        }
    });

    return pool[Math.floor(Math.random() * pool.length)];
}