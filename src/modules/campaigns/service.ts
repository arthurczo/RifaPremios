import { campaignsRepository } from '@/modules/campaigns/repository';

export async function listCampaigns() {
  return campaignsRepository.list();
}

export async function listActiveCampaigns() {
  const campaigns = await campaignsRepository.list();
  return campaigns.filter((campaign) => campaign.status === 'ACTIVE').slice(0, 6);
}

export async function getCampaignById(id: string) {
  return campaignsRepository.findById(id);
}

export async function getCampaignBySlug(slug: string) {
  return campaignsRepository.findBySlug(slug);
}
