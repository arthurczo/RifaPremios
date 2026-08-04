import { prisma } from '@/lib/prisma';
import {
  findDemoCampaignRecordById,
  findDemoCampaignRecordBySlug,
  incrementDemoCampaignSoldNumbers,
  incrementDemoCampaignPendingNumbers,
  releaseDemoCampaignPendingNumbers,
  listDemoCampaignRecords,
  settleDemoCampaignPurchase,
} from '@/server/demo-store';
import { runWithFallback } from '@/server/db-fallback';

function mapCampaign(campaign: any) {
  return {
    ...campaign,
    price: Number(campaign.price),
    roletaRules: campaign.roletaRules as Record<string, number> | null,
  };
}

export const campaignsRepository = {
  async list() {
    return runWithFallback(
      async () => {
        const campaigns = await prisma.campaign.findMany({
          orderBy: { createdAt: 'desc' },
        });

        return campaigns.map(mapCampaign);
      },
      () => listDemoCampaignRecords().map(mapCampaign),
    );
  },

  async findById(id: string) {
    return runWithFallback(
      async () => {
        const campaign = await prisma.campaign.findUnique({
          where: { id },
        });

        return campaign ? mapCampaign(campaign) : null;
      },
      () => {
        const campaign = findDemoCampaignRecordById(id);
        return campaign ? mapCampaign(campaign) : null;
      },
    );
  },

  async findBySlug(slug: string) {
    return runWithFallback(
      async () => {
        const campaign = await prisma.campaign.findUnique({
          where: { slug },
        });

        return campaign ? mapCampaign(campaign) : null;
      },
      () => {
        const campaign = findDemoCampaignRecordBySlug(slug);
        return campaign ? mapCampaign(campaign) : null;
      },
    );
  },

  async incrementSoldNumbers(campaignId: string, quantity: number) {
    return runWithFallback(
      async () => {
        const campaign = await prisma.campaign.update({
          where: { id: campaignId },
          data: {
            soldNumbers: { increment: quantity },
          },
        });

        return mapCampaign(campaign);
      },
      () => {
        const campaign = incrementDemoCampaignSoldNumbers(campaignId, quantity);
        return campaign ? mapCampaign(campaign) : null;
      },
    );
  },

  async incrementPendingNumbers(campaignId: string, quantity: number) {
    return runWithFallback(
      async () => {
        const campaign = await prisma.campaign.update({
          where: { id: campaignId },
          data: {
            pendingNumbers: { increment: quantity },
          },
        });

        return mapCampaign(campaign);
      },
      () => {
        const campaign = incrementDemoCampaignPendingNumbers(campaignId, quantity);
        return campaign ? mapCampaign(campaign) : null;
      },
    );
  },

  async settlePendingPurchase(campaignId: string, quantity: number) {
    return runWithFallback(
      async () => {
        const campaign = await prisma.campaign.update({
          where: { id: campaignId },
          data: {
            pendingNumbers: { decrement: quantity },
            soldNumbers: { increment: quantity },
          },
        });

        return mapCampaign(campaign);
      },
      () => {
        const campaign = settleDemoCampaignPurchase(campaignId, quantity);
        return campaign ? mapCampaign(campaign) : null;
      },
    );
  },

  async releasePendingPurchase(campaignId: string, quantity: number) {
    return runWithFallback(
      async () => {
        const campaign = await prisma.campaign.update({
          where: { id: campaignId },
          data: {
            pendingNumbers: { decrement: quantity },
          },
        });

        return mapCampaign(campaign);
      },
      () => {
        const campaign = releaseDemoCampaignPendingNumbers(campaignId, quantity);
        return campaign ? mapCampaign(campaign) : null;
      },
    );
  },
};
