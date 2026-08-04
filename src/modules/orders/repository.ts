import { prisma } from '@/lib/prisma';
import { createDemoOrder, findDemoOrderByCode, listDemoOrders, updateDemoOrderByCode } from '@/server/demo-store';
import { runWithFallback } from '@/server/db-fallback';

function mapOrder(order: any) {
  return {
    ...order,
    totalAmount: Number(order.totalAmount),
    discountAmount: order.discountAmount != null ? Number(order.discountAmount) : null,
    numbers: order.numbers as string[],
    expiresAt: order.expiresAt ? new Date(order.expiresAt) : null,
  };
}

export const ordersRepository = {
  async list() {
    return runWithFallback(
      async () => {
        const orders = await prisma.order.findMany({
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
            campaign: true,
          },
        });

        return orders.map((order) => ({
          ...mapOrder(order),
          user: order.user,
          campaign: {
            ...order.campaign,
            price: Number(order.campaign.price),
            roletaRules: order.campaign.roletaRules as Record<string, number> | null,
          },
        }));
      },
      () => listDemoOrders(),
    );
  },

  async create(input: {
    userId: string;
    campaignId: string;
    code: string;
    quantity: number;
    totalAmount: number;
    status: 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';
    numbers: string[];
    paymentMethod?: string | null;
    paymentId?: string | null;
    pixCode?: string | null;
    expiresAt?: string | Date | null;
  }) {
    return runWithFallback(
      async () => {
        const order = await prisma.order.create({
          data: {
            ...input,
            expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
          },
        });

        return mapOrder(order);
      },
      () => createDemoOrder(input),
    );
  },

  async findByCode(code: string) {
    return runWithFallback(
      async () => {
        const order = await prisma.order.findUnique({
          where: { code },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
            campaign: true,
          },
        });

        if (!order) {
          return null;
        }

        return {
          ...mapOrder(order),
          user: order.user,
          campaign: {
            ...order.campaign,
            price: Number(order.campaign.price),
            roletaRules: order.campaign.roletaRules as Record<string, number> | null,
          },
        };
      },
      () => findDemoOrderByCode(code),
    );
  },

  async updateByCode(
    code: string,
    patch: {
      status?: 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';
      paymentMethod?: string | null;
      paymentId?: string | null;
      pixCode?: string | null;
      expiresAt?: string | Date | null;
    },
  ) {
    return runWithFallback(
      async () => {
        const order = await prisma.order.update({
          where: { code },
          data: {
            ...patch,
            expiresAt: patch.expiresAt ? new Date(patch.expiresAt) : null,
          },
        });

        return mapOrder(order);
      },
      () => updateDemoOrderByCode(code, patch),
    );
  },
};
