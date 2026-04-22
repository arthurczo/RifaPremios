import { prisma } from '@/lib/prisma';

function mapPrize(prize: Awaited<ReturnType<typeof prisma.prize.findFirstOrThrow>>) {
  return {
    ...prize,
    value: Number(prize.value),
    probability: Number(prize.probability),
  };
}

export const roletaRepository = {
  async listAvailableByUser(userId: string) {
    return prisma.customerRoleta.findMany({
      where: {
        userId,
        available: { gt: 0 },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async listActivePrizes() {
    const prizes = await prisma.prize.findMany({
      where: { active: true },
    });

    return prizes.map(mapPrize);
  },

  async listSpinHistoryByUser(userId: string) {
    const spins = await prisma.roletaSpin.findMany({
      where: {
        customerRoleta: {
          userId,
        },
      },
      orderBy: { spinDate: 'desc' },
      include: {
        prize: true,
      },
      take: 10,
    });

    return spins.map((spin) => ({
      id: String(spin.id),
      roletaId: spin.customerRoletaId,
      prizeId: spin.prizeId,
      prizeName: spin.prize.name,
      prizeType: spin.prize.type,
      prizeValue: Number(spin.prize.value),
      createdAt: spin.spinDate.toISOString(),
    }));
  },

  async findNextAvailableByUser(userId: string) {
    return prisma.customerRoleta.findFirst({
      where: {
        userId,
        available: { gt: 0 },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async grantRoletas(input: {
    userId: string;
    orderId: string;
    campaignId: string;
    quantity: number;
  }) {
    return prisma.customerRoleta.create({
      data: {
        userId: input.userId,
        orderId: input.orderId,
        campaignId: input.campaignId,
        quantity: input.quantity,
        available: input.quantity,
      },
    });
  },

  async consumeOne(roletaId: string) {
    return prisma.customerRoleta.update({
      where: { id: roletaId },
      data: {
        available: { decrement: 1 },
        used: { increment: 1 },
      },
    });
  },

  async createSpin(input: {
    roletaId: string;
    prizeId: string;
  }) {
    return prisma.roletaSpin.create({
      data: {
        customerRoletaId: input.roletaId,
        prizeId: input.prizeId,
      },
    });
  },
};
