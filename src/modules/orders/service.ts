import { requireSessionUser } from '@/modules/auth/service';
import { campaignsRepository } from '@/modules/campaigns/repository';
import { ordersRepository } from '@/modules/orders/repository';
import { calculateRoletasEarned, grantRoletasForOrder } from '@/modules/roleta/service';

export async function listOrders() {
  return ordersRepository.list();
}

export async function listOrdersByCampaign(campaignId: string) {
  const orders = await listOrders();
  return orders.filter((order) => order.campaign?.id === campaignId);
}

export async function createOrderForCurrentUser(campaignId: string, quantity: number) {
  const user = await requireSessionUser();
  const campaign = await campaignsRepository.findById(campaignId);

  if (!campaign) {
    throw new Error('Campanha nao encontrada');
  }

  if (quantity < campaign.minPurchase || quantity > campaign.maxPurchase) {
    throw new Error('Quantidade fora do limite permitido');
  }

  const order = await ordersRepository.create({
    userId: user.id,
    campaignId: campaign.id,
    code: `PED-${generateOrderCode()}`,
    quantity,
    totalAmount: Number((campaign.price * quantity).toFixed(2)),
    status: 'PAID',
    numbers: Array.from({ length: quantity }, () => String(Math.floor(Math.random() * campaign.totalNumbers) + 1).padStart(4, '0')),
  });

  await campaignsRepository.incrementSoldNumbers(campaign.id, quantity);

  const roletasEarned = campaign.roletaEnabled ? calculateRoletasEarned(quantity, campaign.roletaRules) : 0;

  if (roletasEarned > 0) {
    await grantRoletasForOrder({
      userId: user.id,
      orderId: order.id,
      campaignId: campaign.id,
      quantity: roletasEarned,
    });
  }

  return {
    order,
    roletasEarned,
  };
}

function generateOrderCode() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}
