import { randomUUID } from 'crypto';

type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'FINISHED';
type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';
type PrizeType = 'DISCOUNT_PERCENT' | 'DISCOUNT_FIXED' | 'FREE_NUMBERS' | 'NONE';

export interface DemoCampaign {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  status: CampaignStatus;
  price: number;
  totalNumbers: number;
  soldNumbers: number;
  pendingNumbers: number;
  minPurchase: number;
  maxPurchase: number;
  drawDate: string | null;
  roletaEnabled: boolean;
  roletaRules: Record<string, number> | null;
  createdAt: string;
  updatedAt: string;
}

interface DemoUser {
  id: string;
  email: string;
  name: string;
}

interface DemoOrder {
  id: string;
  userId: string;
  campaignId: string;
  code: string;
  quantity: number;
  totalAmount: number;
  status: OrderStatus;
  numbers: string[];
  createdAt: string;
}

interface DemoRoleta {
  id: string;
  userId: string;
  orderId: string;
  campaignId: string;
  quantity: number;
  used: number;
  available: number;
  createdAt: string;
}

interface DemoPrize {
  id: string;
  name: string;
  type: PrizeType;
  value: number;
  probability: number;
  color: string;
  active: boolean;
}

interface DemoSpin {
  id: string;
  roletaId: string;
  prizeId: string;
  prizeName: string;
  prizeType: PrizeType;
  prizeValue: number;
  createdAt: string;
}

interface DemoState {
  user: DemoUser;
  campaigns: DemoCampaign[];
  orders: DemoOrder[];
  roletas: DemoRoleta[];
  prizes: DemoPrize[];
  spins: DemoSpin[];
}

const globalForDemo = globalThis as typeof globalThis & {
  demoState?: DemoState;
};

function now() {
  return new Date().toISOString();
}

function createInitialState(): DemoState {
  const createdAt = now();
  const user = {
    id: 'user-demo',
    email: 'teste@teste.com',
    name: 'Usuario Demo',
  };

  const campaigns: DemoCampaign[] = [
    {
      id: 'camp-1',
      name: 'Honda Civic 2020',
      slug: 'honda-civic-2020',
      description: 'Campanha principal de validacao do fluxo. Compra acima de 100 numeros libera roletas.',
      image: null,
      status: 'ACTIVE',
      price: 0.07,
      totalNumbers: 1000,
      soldNumbers: 120,
      pendingNumbers: 0,
      minPurchase: 10,
      maxPurchase: 100,
      drawDate: null,
      roletaEnabled: true,
      roletaRules: { '50': 1, '100': 3 },
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: 'camp-2',
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'Rifa secundaria para validar listagem e detalhe de campanha com compra simples.',
      image: null,
      status: 'ACTIVE',
      price: 0.15,
      totalNumbers: 500,
      soldNumbers: 45,
      pendingNumbers: 0,
      minPurchase: 10,
      maxPurchase: 100,
      drawDate: null,
      roletaEnabled: false,
      roletaRules: null,
      createdAt,
      updatedAt: createdAt,
    },
  ];

  const initialOrder: DemoOrder = {
    id: 'order-seed',
    userId: user.id,
    campaignId: campaigns[0].id,
    code: 'PED-SEED01',
    quantity: 100,
    totalAmount: 7,
    status: 'PAID',
    numbers: ['0001', '0002', '0003'],
    createdAt,
  };

  const roletas: DemoRoleta[] = [
    {
      id: 'roleta-seed',
      userId: user.id,
      orderId: initialOrder.id,
      campaignId: campaigns[0].id,
      quantity: 3,
      used: 0,
      available: 3,
      createdAt,
    },
  ];

  const prizes: DemoPrize[] = [
    { id: 'prize-1', name: '5% OFF', type: 'DISCOUNT_PERCENT', value: 5, probability: 30, color: '#FF6B6B', active: true },
    { id: 'prize-2', name: '10% OFF', type: 'DISCOUNT_PERCENT', value: 10, probability: 25, color: '#4ECDC4', active: true },
    { id: 'prize-3', name: '20% OFF', type: 'DISCOUNT_PERCENT', value: 20, probability: 15, color: '#FFD93D', active: true },
    { id: 'prize-4', name: '10 numeros gratis', type: 'FREE_NUMBERS', value: 10, probability: 20, color: '#6BCF7F', active: true },
    { id: 'prize-5', name: 'Tente novamente', type: 'NONE', value: 0, probability: 10, color: '#C77DFF', active: true },
  ];

  return {
    user,
    campaigns,
    orders: [initialOrder],
    roletas,
    prizes,
    spins: [],
  };
}

function getState() {
  if (!globalForDemo.demoState) {
    globalForDemo.demoState = createInitialState();
  }

  return globalForDemo.demoState;
}

export function getDemoUser() {
  return getState().user;
}

export function getCampaigns() {
  return getState().campaigns;
}

export function getCampaignBySlug(slug: string) {
  return getState().campaigns.find((campaign) => campaign.slug === slug) ?? null;
}

export function getCampaignById(id: string) {
  return getState().campaigns.find((campaign) => campaign.id === id) ?? null;
}

export function getOrders() {
  const state = getState();

  return [...state.orders]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((order) => ({
      ...order,
      user: state.user,
      campaign: getCampaignById(order.campaignId),
    }));
}

export function getOrdersByCampaign(campaignId: string) {
  return getOrders().filter((order) => order.campaign?.id === campaignId);
}

export function getAvailableRoletas() {
  const state = getState();

  return state.roletas.filter((roleta) => roleta.available > 0);
}

export function getSpinHistory() {
  return [...getState().spins].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function calculateRoletas(quantity: number, rules: Record<string, number> | null) {
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

export function createDemoOrder(campaignId: string, quantity: number) {
  const state = getState();
  const campaign = getCampaignById(campaignId);

  if (!campaign) {
    throw new Error('Campanha nao encontrada');
  }

  if (quantity < campaign.minPurchase || quantity > campaign.maxPurchase) {
    throw new Error('Quantidade fora do limite permitido');
  }

  const createdAt = now();
  const order: DemoOrder = {
    id: randomUUID(),
    userId: state.user.id,
    campaignId: campaign.id,
    code: `PED-${randomUUID().slice(0, 8).toUpperCase()}`,
    quantity,
    totalAmount: Number((campaign.price * quantity).toFixed(2)),
    status: 'PAID',
    numbers: Array.from({ length: quantity }, () => String(Math.floor(Math.random() * campaign.totalNumbers) + 1).padStart(4, '0')),
    createdAt,
  };

  state.orders.unshift(order);
  campaign.soldNumbers += quantity;
  campaign.updatedAt = createdAt;

  const roletasEarned = campaign.roletaEnabled ? calculateRoletas(quantity, campaign.roletaRules) : 0;

  if (roletasEarned > 0) {
    state.roletas.unshift({
      id: randomUUID(),
      userId: state.user.id,
      orderId: order.id,
      campaignId: campaign.id,
      quantity: roletasEarned,
      used: 0,
      available: roletasEarned,
      createdAt,
    });
  }

  return {
    order,
    roletasEarned,
  };
}

export function spinDemoRoleta() {
  const state = getState();
  const roleta = state.roletas.find((entry) => entry.available > 0);

  if (!roleta) {
    throw new Error('Sem roletas disponiveis');
  }

  const activePrizes = state.prizes.filter((prize) => prize.active);
  const pool: DemoPrize[] = [];

  activePrizes.forEach((prize) => {
    for (let index = 0; index < prize.probability; index += 1) {
      pool.push(prize);
    }
  });

  const prize = pool[Math.floor(Math.random() * pool.length)];
  const createdAt = now();

  roleta.available -= 1;
  roleta.used += 1;
  state.spins.unshift({
    id: randomUUID(),
    roletaId: roleta.id,
    prizeId: prize.id,
    prizeName: prize.name,
    prizeType: prize.type,
    prizeValue: prize.value,
    createdAt,
  });

  return {
    prize: {
      id: prize.id,
      name: prize.name,
      type: prize.type,
      value: prize.value,
      color: prize.color,
    },
    remaining: state.roletas.reduce((total, entry) => total + entry.available, 0),
    history: getSpinHistory().slice(0, 10),
  };
}
