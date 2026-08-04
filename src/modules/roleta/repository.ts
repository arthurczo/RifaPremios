import { prisma } from '@/lib/prisma';
import {
  consumeDemoRoleta,
  createDemoSpin,
  findDemoNextAvailableRoletaByUser,
  grantDemoRoletas,
  listDemoActivePrizes,
  listDemoAvailableRoletasByUser,
  listDemoSpinHistoryByUser,
} from '@/server/demo-store';
import { runWithFallback } from '@/server/db-fallback';

function mapPrize(prize: any) {
  return {
    ...prize,
    value: Number(prize.value),
    probability: Number(prize.probability),
  };
}

export const roletaRepository = {
  async listAvailableByUser(userId: string) {
    return runWithFallback(
      () =>
        prisma.customerRoleta.findMany({
          where: {
            userId,
            available: { gt: 0 },
          },
          orderBy: { createdAt: 'desc' },
        }),
      () => listDemoAvailableRoletasByUser(userId),
    );
  },

  async listActivePrizes() {
    return runWithFallback(
      async () => {
        const prizes = await prisma.prize.findMany({
          where: { active: true },
        });

        return prizes.map(mapPrize);
      },
      () => listDemoActivePrizes().map(mapPrize),
    );
  },

  async listSpinHistoryByUser(userId: string) {
    return runWithFallback(
      async () => {
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
      () => listDemoSpinHistoryByUser(userId),
    );
  },

  async findNextAvailableByUser(userId: string) {
    return runWithFallback(
      () =>
        prisma.customerRoleta.findFirst({
          where: {
            userId,
            available: { gt: 0 },
          },
          orderBy: { createdAt: 'desc' },
        }),
      () => findDemoNextAvailableRoletaByUser(userId),
    );
  },

  async grantRoletas(input: {
    userId: string;
    orderId: string;
    campaignId: string;
    quantity: number;
  }) {
    return runWithFallback(
      () =>
        prisma.customerRoleta.create({
          data: {
            userId: input.userId,
            orderId: input.orderId,
            campaignId: input.campaignId,
            quantity: input.quantity,
            available: input.quantity,
          },
        }),
      () => grantDemoRoletas(input),
    );
  },

  async consumeOne(roletaId: string) {
    return runWithFallback(
      () =>
        prisma.customerRoleta.update({
          where: { id: roletaId },
          data: {
            available: { decrement: 1 },
            used: { increment: 1 },
          },
        }),
      () => consumeDemoRoleta(roletaId),
    );
  },

  async createSpin(input: {
    roletaId: string;
    prizeId: string;
  }) {
    return runWithFallback(
      () =>
        prisma.roletaSpin.create({
          data: {
            customerRoletaId: input.roletaId,
            prizeId: input.prizeId,
          },
        }),
      () => createDemoSpin(input),
    );
  },
};
