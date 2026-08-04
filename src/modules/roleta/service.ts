import { requireSessionUser } from '@/modules/auth/service';
import { roletaRepository } from '@/modules/roleta/repository';

export async function listAvailableRoletasForCurrentUser() {
  const user = await requireSessionUser();
  return roletaRepository.listAvailableByUser(user.id);
}

export async function listSpinHistory() {
  const user = await requireSessionUser();
  return roletaRepository.listSpinHistoryByUser(user.id);
}

export function calculateRoletasEarned(quantity: number, rules: Record<string, number> | null) {
  if (!rules) {
    return 0;
  }

  return Object.entries(rules).reduce((total, [threshold, spins]) => {
    const requiredQuantity = Number(threshold);

    if (!Number.isFinite(requiredQuantity) || requiredQuantity <= 0) {
      return total;
    }

    return total + Math.floor(quantity / requiredQuantity) * spins;
  }, 0);
}

export async function grantRoletasForOrder(input: {
  userId: string;
  orderId: string;
  campaignId: string;
  quantity: number;
}) {
  return roletaRepository.grantRoletas(input);
}

export async function spinCurrentUserRoleta() {
  const user = await requireSessionUser();
  const roleta = await roletaRepository.findNextAvailableByUser(user.id);

  if (!roleta) {
    throw new Error('Sem roletas disponiveis');
  }

  const activePrizes = await roletaRepository.listActivePrizes();

  if (activePrizes.length === 0) {
    throw new Error('Nenhum premio ativo configurado');
  }

  const pool = activePrizes.flatMap((prize) => Array.from({ length: prize.probability }, () => prize));
  const prize = pool[Math.floor(Math.random() * pool.length)];

  await roletaRepository.consumeOne(roleta.id);
  await roletaRepository.createSpin({
    roletaId: roleta.id,
    prizeId: prize.id,
  });

  const remainingRoletas = await listAvailableRoletasForCurrentUser();

  return {
    prize: {
      id: prize.id,
      name: prize.name,
      type: prize.type,
      value: prize.value,
      color: prize.color,
    },
    remaining: remainingRoletas.reduce((total, entry) => total + entry.available, 0),
    history: await listSpinHistory(),
  };
}
