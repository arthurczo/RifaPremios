import { prisma } from '@/lib/prisma';

function mapOrder(order: Awaited<ReturnType<typeof prisma.order.findFirstOrThrow>>) {
  return {
    ...order,
    totalAmount: Number(order.totalAmount),
    discountAmount: order.discountAmount ? Number(order.discountAmount) : null,
    numbers: order.numbers as string[],
  };
}

export const ordersRepository = {
  async list() {
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

  async create(input: {
    userId: string;
    campaignId: string;
    code: string;
    quantity: number;
    totalAmount: number;
    status: 'PAID';
    numbers: string[];
  }) {
    const order = await prisma.order.create({
      data: {
        ...input,
      },
    });

    return mapOrder(order);
  },
};
