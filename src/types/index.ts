export interface CampaignSummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  price: number;
  totalNumbers: number;
  soldNumbers: number;
  pendingNumbers: number;
  minPurchase: number;
  maxPurchase: number;
  roletaEnabled: boolean;
}

export interface PrizeResult {
  id: string;
  name: string;
  type: string;
  value: number;
  color: string;
}
