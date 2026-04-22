import { prisma } from '@/lib/prisma';

function mapCampaign(campaign: Awaited<ReturnType<typeof prisma.campaign.findFirstOrThrow>>) {
  return {
    ...campaign,
    price: Number(campaign.price),
    roletaRules: campaign.roletaRules as Record<string, number> | null,
  };
}

export const campaignsRepository = {
  async list() {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return campaigns.map(mapCampaign);
  },

  async findById(id: string) {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });

    return campaign ? mapCampaign(campaign) : null;
  },

  async findBySlug(slug: string) {
    const campaign = await prisma.campaign.findUnique({
      where: { slug },
    });

    return campaign ? mapCampaign(campaign) : null;
  },

  async incrementSoldNumbers(campaignId: string, quantity: number) {
    const campaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        soldNumbers: { increment: quantity },
      },
    });

    return mapCampaign(campaign);
  },
};
