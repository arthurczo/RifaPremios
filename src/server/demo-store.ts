export type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'FINISHED';
export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';
export type PrizeType = 'DISCOUNT_PERCENT' | 'DISCOUNT_FIXED' | 'FREE_NUMBERS' | 'NONE';

export interface DemoCampaignRecord {
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

export interface DemoUserRecord {
  id: string;
  email: string;
  name: string;
}

export interface DemoOrderRecord {
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

export interface DemoRoletaRecord {
  id: string;
  userId: string;
  orderId: string;
  campaignId: string;
  quantity: number;
  used: number;
  available: number;
  createdAt: string;
}

export interface DemoPrizeRecord {
  id: string;
  name: string;
  type: PrizeType;
  value: number;
  probability: number;
  color: string;
  active: boolean;
}

export interface DemoSpinRecord {
  id: string;
  roletaId: string;
  prizeId: string;
  prizeName: string;
  prizeType: PrizeType;
  prizeValue: number;
  createdAt: string;
}

export interface DemoState {
  user: DemoUserRecord;
  campaigns: DemoCampaignRecord[];
  orders: DemoOrderRecord[];
  roletas: DemoRoletaRecord[];
  prizes: DemoPrizeRecord[];
  spins: DemoSpinRecord[];
}

const globalForDemo = globalThis as typeof globalThis & {
  demoState?: DemoState;
};

export function nowIso() {
  return new Date().toISOString();
}

function createInitialState(): DemoState {
  const createdAt = nowIso();
  const user: DemoUserRecord = {
    id: 'user-demo',
    email: 'teste@teste.com',
    name: 'Usuario Demo',
  };

  const campaigns: DemoCampaignRecord[] = [
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

  const initialOrder: DemoOrderRecord = {
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

  const roletas: DemoRoletaRecord[] = [
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

  const prizes: DemoPrizeRecord[] = [
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

export function getDemoState() {
  if (!globalForDemo.demoState) {
    globalForDemo.demoState = createInitialState();
  }

  return globalForDemo.demoState;
}

export function generateId() {
  return crypto.randomUUID();
}
